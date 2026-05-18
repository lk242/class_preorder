import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth, isConfigured } from '../config/firebase';

const AuthContext = createContext(null);

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured) return;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAdmin = Boolean(
    user && ADMIN_EMAILS.includes(user.email?.toLowerCase())
  );

  const loginWithGoogle = async (scopes = []) => {
    if (!isConfigured) {
      alert('Firebase 尚未設定。\n請複製 .env.example 為 .env 並填入你的 Firebase 專案資訊。');
      return null;
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: scopes.length > 0 ? 'consent select_account' : 'select_account' });
    scopes.forEach(s => provider.addScope(s));
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) setAccessToken(credential.accessToken);
    return {
      user: result.user,
      accessToken: credential?.accessToken || null
    };
  };

  const logout = async () => {
    if (!isConfigured) return;
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, isAdmin, loginWithGoogle, logout, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
