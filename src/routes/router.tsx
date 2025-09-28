import { createBrowserRouter } from 'react-router';
import BaseRoute from './BaseRoute';
import FaqRoute from './FaqRoute';
import GameRoute from './GameRoute';
import LinkNumberRoute from './LinkNumberRoute';
import StartRoute from './StartRoute';
import { routes } from './paths';

export const router = createBrowserRouter([
  { path: routes.start, element: <StartRoute /> },
  { path: routes.game, element: <GameRoute /> },
  { path: routes.faq, element: <FaqRoute /> },
  { path: routes.base, element: <BaseRoute /> },
  { path: routes.linkNumber, element: <LinkNumberRoute /> },
]);

export default router;
