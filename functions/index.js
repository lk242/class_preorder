const admin = require('firebase-admin');
const logger = require('firebase-functions/logger');
const { defineSecret } = require('firebase-functions/params');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const nodemailer = require('nodemailer');

admin.initializeApp();

const SMTP_HOST = defineSecret('SMTP_HOST');
const SMTP_PORT = defineSecret('SMTP_PORT');
const SMTP_USER = defineSecret('SMTP_USER');
const SMTP_PASS = defineSecret('SMTP_PASS');
const SMTP_FROM = defineSecret('SMTP_FROM');
const SMTP_SECURE = defineSecret('SMTP_SECURE');

exports.sendAdminRegistrationNotification = onDocumentCreated(
  {
    document: 'registrations/{registrationId}',
    region: 'asia-east1',
    secrets: [SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_SECURE]
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn('Registration trigger fired without snapshot data.');
      return;
    }

    const registration = snapshot.data();
    const settingsSnap = await admin.firestore().doc('appSettings/notifications').get();
    const settings = settingsSnap.exists ? settingsSnap.data() : {};
    const enabled = Boolean(settings?.adminRegistrationEmailEnabled);
    const recipients = Array.isArray(settings?.adminNotificationEmails)
      ? settings.adminNotificationEmails.filter(Boolean)
      : [];

    if (!enabled) {
      logger.info('Admin registration email notifications are disabled.');
      return;
    }

    if (recipients.length === 0) {
      logger.warn('Admin registration email notifications are enabled but no recipient emails are configured.');
      return;
    }

    const smtpHost = SMTP_HOST.value();
    const smtpPort = Number(SMTP_PORT.value() || '587');
    const smtpUser = SMTP_USER.value();
    const smtpPass = SMTP_PASS.value();
    const smtpFrom = SMTP_FROM.value();
    const smtpSecure = String(SMTP_SECURE.value() || '').toLowerCase() === 'true';

    if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
      logger.warn('SMTP secrets are incomplete; skipping admin registration email send.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure || smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const subject = `新報名通知：${registration.courseTitle || '未命名課程'}`;
    const lines = [
      '有新的課程報名。',
      '',
      `課程：${registration.courseTitle || '未提供'}`,
      `姓名：${registration.name || '未提供'}`,
      `電話：${registration.phone || '未提供'}`,
      `Email：${registration.email || '未提供'}`,
      `LINE ID：${registration.lineId || '未提供'}`,
      `報名時間：${registration.time || '未提供'}`
    ];

    await transporter.sendMail({
      from: smtpFrom,
      to: recipients.join(','),
      subject,
      text: lines.join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>有新的課程報名</h2>
          <p><strong>課程：</strong>${registration.courseTitle || '未提供'}</p>
          <p><strong>姓名：</strong>${registration.name || '未提供'}</p>
          <p><strong>電話：</strong>${registration.phone || '未提供'}</p>
          <p><strong>Email：</strong>${registration.email || '未提供'}</p>
          <p><strong>LINE ID：</strong>${registration.lineId || '未提供'}</p>
          <p><strong>報名時間：</strong>${registration.time || '未提供'}</p>
        </div>
      `
    });

    logger.info('Admin registration notification sent.', {
      registrationId: snapshot.id,
      recipientsCount: recipients.length
    });
  }
);
