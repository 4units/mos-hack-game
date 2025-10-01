import { createBrowserRouter } from 'react-router';
import FaqRoute from './FaqRoute';
import GameRoute from './GameRoute';
import LinkNumberRoute from './LinkNumberRoute';
import LinkNumberDemoRoute from './LinkNumberDemoRoute';
import RewardsRoute from './RewardsRoute';
import StartRoute from './StartRoute';
import { routes } from './paths';

export const router = createBrowserRouter([
  { path: routes.start, element: <StartRoute /> },
  { path: routes.game, element: <GameRoute /> },
  { path: routes.faq, element: <FaqRoute /> },
  { path: routes.linkNumber, element: <LinkNumberRoute /> },
  { path: routes.linkNumberDemo, element: <LinkNumberDemoRoute /> },
  { path: routes.rewards, element: <RewardsRoute /> },
]);

export default router;
