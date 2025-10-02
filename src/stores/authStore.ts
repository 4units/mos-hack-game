import { create } from 'zustand';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE } from '../config';

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

const initialToken = Cookies.get(TOKEN_COOKIE) ?? null;
const initialExpiresAt = getTokenExpiryMs(initialToken);

let expiryTimer: number | null = null;

const scheduleExpiry = (expMs: number | null, clearFn: () => void) => {
  if (expiryTimer) {
    clearTimeout(expiryTimer);
    expiryTimer = null;
  }
  if (expMs && expMs > Date.now()) {
    const delay = Math.max(0, expMs - Date.now());
    expiryTimer = window.setTimeout(() => {
      clearFn();
    }, delay);
  }
};

export const authStore = create<AuthState>((set, get) => ({
  token: initialToken,
  expiresAt: initialExpiresAt,
  isAuthenticated: isTokenValid(initialToken),
  setToken: (token) => {
    const expMs = getTokenExpiryMs(token);
    // Persist in cookie, respecting exp if present
    try {
      if (expMs) {
        Cookies.set(TOKEN_COOKIE, token, {
          sameSite: 'lax',
          path: '/',
          secure: typeof window !== 'undefined' && window.location?.protocol === 'https:',
          expires: new Date(expMs),
        });
      } else {
        Cookies.set(TOKEN_COOKIE, token, {
          sameSite: 'lax',
          path: '/',
          secure: typeof window !== 'undefined' && window.location?.protocol === 'https:',
        });
      }
    } catch (error) {
      console.error(error);
    }

    set({ token, expiresAt: expMs ?? null, isAuthenticated: isTokenValid(token) });
    scheduleExpiry(expMs ?? null, () => get().clear());
  },
  clear: () => {
    try {
      Cookies.remove(TOKEN_COOKIE, { path: '/' });
    } catch (error) {
      console.error(error);
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
  if (initialExpiresAt && initialExpiresAt > Date.now()) {
    const now = Date.now();
    const delay = Math.max(0, initialExpiresAt - now);
     
    expiryTimer = window.setTimeout(() => {
      authStore.getState().clear();
    }, delay);
  }
} catch (error) {
  console.error(error);
}
