import { createBrowserRouter } from 'react-router';
import FaqRoute from './FaqRoute.tsx';
import GameRoute from './GameRoute.tsx';
import LinkNumberRoute from './LinkNumberRoute.tsx';
import LinkNumberDemoRoute from './LinkNumberDemoRoute.tsx';
import RewardsRoute from './RewardsRoute.tsx';
import StartRoute from './StartRoute.tsx';
import { routes } from './paths.ts';
import { RequireAuth } from './guards.tsx';
import NotFoundRoute from './NotFoundRoute.tsx';

export const router = createBrowserRouter([
  { path: routes.start, element: <StartRoute /> },
  {
    path: routes.game,
    element: (
      <RequireAuth>
        <GameRoute />
      </RequireAuth>
    ),
  },
  { path: routes.faq, element: <FaqRoute /> },
  {
    path: routes.linkNumber,
    element: (
      <RequireAuth>
        <LinkNumberRoute />
      </RequireAuth>
    ),
  },
  {
    path: routes.linkNumberDemo,
    element: (
      <RequireAuth>
        <LinkNumberDemoRoute />
      </RequireAuth>
    ),
  },
  {
    path: routes.rewards,
    element: (
      <RequireAuth>
        <RewardsRoute />
      </RequireAuth>
    ),
  },
  { path: '*', element: <NotFoundRoute /> },
]);

export default router;
