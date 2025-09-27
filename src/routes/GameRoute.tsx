import { useNavigate } from 'react-router';
import GameScreen from '../screens/GameScreen';
import { routes } from './paths';

const GameRoute = () => {
  const navigate = useNavigate();

  return (
    <GameScreen onShowBase={() => navigate(routes.base)} onShowFaq={() => navigate(routes.faq)} />
  );
};

export default GameRoute;
