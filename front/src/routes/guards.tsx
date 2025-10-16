import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore, isTokenValid } from '../stores/authStore.ts';
import { AUTH_TOKEN_KEY } from '../config.ts';
import { routes } from './paths.ts';

export const RequireAuth = ({ children }: PropsWithChildren) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  let storageToken: string | null = null;
  try {
    storageToken =
      typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
  } catch {
    /* Empty */
  }
  const hasValidToken = isAuthenticated || isTokenValid(storageToken ?? undefined);

  const location = useLocation();
  if (!hasValidToken) return <Navigate to={routes.start} replace state={{ from: location }} />;
  return <>{children}</>;
};

export const RequireGuest = ({ children }: PropsWithChildren) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  let storageToken: string | null = null;
  try {
    storageToken =
      typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
  } catch {
    /* Empty */
  }
  const hasValidToken = isAuthenticated || isTokenValid(storageToken ?? undefined);

  if (hasValidToken) return <Navigate to={routes.game} replace />;
  return <>{children}</>;
};

export default RequireAuth;
