import { useNavigate } from 'react-router';
import LinkNumberScreen from '../screens/game/LinkNumberScreen.tsx';
import { routes } from './paths.ts';
import useLinkNumberLevel from '../hooks/useLinkNumberLevel.ts';

const LinkNumberRoute = () => {
  const navigate = useNavigate();
  const { data: level, isLoading, isError, refetch } = useLinkNumberLevel();

  if (isLoading) {
    return (
      <div className="main-bg flex min-h-screen items-center justify-center text-[var(--color-on-surface)]">
        Загрузка уровня...
      </div>
    );
  }

  if (isError || !level) {
    return (
      <div className="main-bg flex min-h-screen items-center justify-center text-[var(--color-on-surface)]">
        <div className="flex flex-col items-center gap-4">
          <span>Не удалось загрузить уровень.</span>
          <button
            type="button"
            className="button-blur"
            onClick={() => {
              void refetch();
            }}
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  return <LinkNumberScreen onBack={() => navigate(routes.game)} level={level} />;
};

export default LinkNumberRoute;
