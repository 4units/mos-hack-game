import { create } from 'zustand';
import { AUTH_TOKEN_KEY } from '../config';

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

const base64UrlDecode = (str: string): string => {
  try {
    const pad = str.length % 4;
    const padded = str.replace(/-/g, '+').replace(/_/g, '/') + (pad ? '='.repeat(4 - pad) : '');
    return atob(padded);
  } catch {
    return '';
  }
};

export const getJwtPayload = (token: string | null | undefined): JwtPayload | null => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
};

export const getTokenExpiryMs = (token: string | null | undefined): number | null => {
  const payload = getJwtPayload(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
};

export const isTokenValid = (token: string | null | undefined): boolean => {
  if (!token) return false;
  const expMs = getTokenExpiryMs(token);
  if (!expMs) return true;
  return Date.now() < expMs;
};

type AuthState = {
  token: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clear: () => void;
};

let initialToken: string | null = null;
try {
  initialToken = typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
} catch {
  initialToken = null;
}
console.log('[authStore] initial token', initialToken);
const initialExpiresAt = getTokenExpiryMs(initialToken);

let expiryTimer: number | null = null;
const MAX_TIMEOUT = 2_147_483_647; // ~24.8 days, JS timer limit

const scheduleExpiry = (expMs: number | null, clearFn: () => void) => {
  if (expiryTimer) {
    clearTimeout(expiryTimer);
    expiryTimer = null;
    console.log('[authStore] cleared previous expiry timer');
  }

  if (!expMs) return;

  const now = Date.now();
  if (expMs <= now) {
    console.log('[authStore] token already expired');
    clearFn();
    return;
  }

  const remaining = expMs - now;
  const delay = Math.min(remaining, MAX_TIMEOUT);
  console.log('[authStore] scheduling expiry chunk in ms', delay, 'remaining', remaining);

  expiryTimer = window.setTimeout(() => {
    expiryTimer = null;
    const nextRemaining = expMs - Date.now();
    console.log('[authStore] expiry chunk completed, remaining', nextRemaining);

    if (nextRemaining <= 0) {
      console.log('[authStore] expiry reached, clearing state');
      clearFn();
      return;
    }

    if (nextRemaining > MAX_TIMEOUT) {
      console.log('[authStore] re-scheduling long expiry, leftover ms', nextRemaining);
    }
    scheduleExpiry(expMs, clearFn);
  }, delay);
};

export const authStore = create<AuthState>((set, get) => ({
  token: initialToken,
  expiresAt: initialExpiresAt,
  isAuthenticated: isTokenValid(initialToken),
  setToken: (token) => {
    console.log('[authStore] setToken called', token);
    const expMs = getTokenExpiryMs(token);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(AUTH_TOKEN_KEY, token);
        console.log('[authStore] localStorage set', token);
      }
    } catch {
      /* Empty */
    }

    set({ token, expiresAt: expMs ?? null, isAuthenticated: isTokenValid(token) });
    console.log('[authStore] state after set', {
      token,
      expiresAt: expMs ?? null,
      isAuthenticated: isTokenValid(token),
    });
    scheduleExpiry(expMs ?? null, () => get().clear());
  },
  clear: () => {
    console.log('[authStore] clear called');
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        console.log('[authStore] localStorage cleared');
      }
    } catch {
      /* Empty */
    }
    set({ token: null, expiresAt: null, isAuthenticated: false });
    if (expiryTimer) {
      clearTimeout(expiryTimer);
      expiryTimer = null;
    }
  },
}));

export const useAuthStore = authStore;

try {
  if (initialExpiresAt) {
    console.log('[authStore] scheduling initial expiry');
    scheduleExpiry(initialExpiresAt, () => authStore.getState().clear());
  }
} catch (error) {
  console.error(error);
}
