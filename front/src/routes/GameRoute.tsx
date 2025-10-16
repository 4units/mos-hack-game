import { useNavigate } from 'react-router';
import GameScreen from '../screens/GameScreen.tsx';
import { routes } from './paths.ts';

const GameRoute = () => {
  const navigate = useNavigate();

  return (
    <GameScreen
      onShowGifts={() => navigate(routes.rewards)}
      onShowFaq={() => navigate(routes.faq)}
      onStartLinkNumber={() => navigate(routes.linkNumber)}
    />
  );
};

export default GameRoute;
