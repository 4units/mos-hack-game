import { createBrowserRouter } from 'react-router';
import FaqRoute from './FaqRoute';
import GameRoute from './GameRoute';
import LinkNumberRoute from './LinkNumberRoute';
import LinkNumberDemoRoute from './LinkNumberDemoRoute';
import RewardsRoute from './RewardsRoute';
import StartRoute from './StartRoute';
import { routes } from './paths';
import { RequireAuth } from './guards';
import NotFoundRoute from './NotFoundRoute';

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
