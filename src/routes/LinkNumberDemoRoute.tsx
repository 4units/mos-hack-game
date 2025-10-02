import { useNavigate } from 'react-router';
import demo from '../assets/demo.png';
import { routes } from './paths';
const LinkNumberDemoRoute = () => {
  const navigate = useNavigate();

  return (
    <main className="main-bg flex min-h-screen bg-[var(--color-surface)] justify-center">
      <div
        className="relative flex w-full max-w-[25rem] flex-col gap-7 justify-between text-[var(--color-on-surface)]"
        aria-label="Как играть — подсказки"
      >
        <img src={demo} alt="Как играть — подсказки" />
        <button
          type="button"
          className="w-full rounded-[13px] border-0 bg-[var(--color-violet)] px-4 py-3"
          onClick={() => navigate(routes.game)}
        >
          <span className="font-medium text-white text-1">Играть</span>
        </button>
      </div>
    </main>
  );
};

export default LinkNumberDemoRoute;
