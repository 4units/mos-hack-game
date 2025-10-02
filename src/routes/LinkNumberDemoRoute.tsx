import { useNavigate } from 'react-router';
import demo from '../assets/demo.png';
import { routes } from './paths';
const LinkNumberDemoRoute = () => {
  const navigate = useNavigate();

  return (
    <main className="main-bg relative flex min-h-screen justify-center bg-[var(--color-surface)]">
      <div
        className="tutorial-overlay absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="relative z-10 flex w-full max-w-[25rem] flex-col gap-7 px-4 pb-0 pt-0 text-[var(--color-on-surface)]"
        aria-label="Как играть — подсказки"
      >
        <img src={demo} alt="Как играть — подсказки" className="w-full" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-6">
        <button
          type="button"
          className="w-full max-w-[25rem] rounded-[13px] border-0 bg-[var(--color-violet)] px-4 py-3"
          onClick={() => navigate(routes.game)}
        >
          <span className="font-medium text-white text-1">Играть</span>
        </button>
      </div>
    </main>
  );
};

export default LinkNumberDemoRoute;
