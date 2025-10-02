import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import gazikLost from '../assets/gazik.png';
import { routes } from '../routes/paths';
import { useAuthStore } from '../stores/authStore';

const NotFoundScreen = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const targetRoute = useMemo(
    () => (isAuthenticated ? routes.game : routes.start),
    [isAuthenticated]
  );

  return (
    <main className="main-bg flex min-h-screen bg-[var(--color-surface)] justify-center">
      <div className="flex w-full max-w-[25rem] flex-col gap-7 items-center justify-center text-[var(--color-on-surface)]">
        <img
          src={gazikLost}
          alt="Газик заблудился"
          className="h-auto max-h-[360px] w-full max-w-[320px] select-none pointer-events-none"
          draggable={false}
        />
        <h1 className="text-center">404... Газик заблудился</h1>
        <button
          onClick={() => navigate(targetRoute, { replace: true })}
          type="button"
          className="button-blur w-full"
          aria-label={'Помочь Газику'}
        >
          <span className="text-[var(--color-raspberry)]">Помочь Газику</span>
        </button>
      </div>
    </main>
  );
};

export default NotFoundScreen;
