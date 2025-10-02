import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router';
import Cookies from 'js-cookie';
import { useAuthStore, isTokenValid } from '../stores/authStore';
import { TOKEN_COOKIE } from '../config';
import { routes } from './paths';

export const RequireAuth = ({ children }: PropsWithChildren) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const cookieToken = Cookies.get(TOKEN_COOKIE) ?? null;
  const hasValidToken = isAuthenticated || isTokenValid(cookieToken);

  const location = useLocation();
  if (!hasValidToken) return <Navigate to={routes.start} replace state={{ from: location }} />;
  return <>{children}</>;
};

export const RequireGuest = ({ children }: PropsWithChildren) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const cookieToken = Cookies.get(TOKEN_COOKIE) ?? null;
  const hasValidToken = isAuthenticated || isTokenValid(cookieToken);

  if (hasValidToken) return <Navigate to={routes.game} replace />;
  return <>{children}</>;
};

export default RequireAuth;
