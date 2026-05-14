const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

export async function createCalendarEvent(accessToken, course) {
  const startDateTime = `${course.date}T${course.start}:00`;
  const endDateTime = `${course.date}T${course.end}:00`;

  const event = {
    summary: course.title,
    description: course.desc || '',
    start: { dateTime: startDateTime, timeZone: 'Asia/Taipei' },
    end: { dateTime: endDateTime, timeZone: 'Asia/Taipei' },
  };

  const res = await fetch(`${CALENDAR_API}/calendars/primary/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Calendar API 錯誤 (${res.status})`);
  }
  return res.json();
}

export async function syncAllCoursesToCalendar(accessToken, courses) {
  const results = { success: 0, failed: 0, errors: [] };
  for (const course of courses) {
    try {
      await createCalendarEvent(accessToken, course);
      results.success++;
    } catch (err) {
      results.failed++;
      results.errors.push(`${course.title}: ${err.message}`);
    }
  }
  return results;
}

export function buildCalendarUrl(course) {
  const start = `${course.date.replace(/-/g, '')}T${course.start.replace(':', '')}00`;
  const end = `${course.date.replace(/-/g, '')}T${course.end.replace(':', '')}00`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: course.title,
    dates: `${start}/${end}`,
    details: course.desc || '',
    ctz: 'Asia/Taipei',
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
