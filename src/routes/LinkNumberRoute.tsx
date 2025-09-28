import { useNavigate } from 'react-router';
import LinkNumberScreen from '../screens/game/LinkNumberScreen';
import { basicLevel } from '../screens/game/kit/link-number/levels';
import { routes } from './paths';

const LinkNumberRoute = () => {
  const navigate = useNavigate();

  return <LinkNumberScreen onBack={() => navigate(routes.game)} level={basicLevel} />;
};

export default LinkNumberRoute;
