import { useState, useEffect } from 'react';

// ─── Token Keys ───────────────────────────────────────────────────────────────
export const ACCESS_TOKEN  = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';

// ─── Token Helpers ────────────────────────────────────────────────────────────
export const getAccessToken  = () => localStorage.getItem(ACCESS_TOKEN);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

export const setTokens = (access, refresh) => {
  localStorage.setItem(ACCESS_TOKEN, access);
  localStorage.setItem(REFRESH_TOKEN, refresh);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};

export const isAuthenticated = () => !!getAccessToken();

// ─── useAuthentication Hook ───────────────────────────────────────────────────
// This hook provides auth state and logout function to any component
export const useAuthentication = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check token on mount and whenever localStorage changes
    const checkAuth = () => {
      const token = getAccessToken();
      setIsAuth(!!token);
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (e.g. logout in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const logout = () => {
    clearTokens();
    setIsAuth(false);
    window.location.href = '/login';
  };

  return { isAuth, loading, logout };
};