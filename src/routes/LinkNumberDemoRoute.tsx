import { useNavigate } from 'react-router';
import LinkNumberScreen from '../screens/game/LinkNumberScreen';
import { basicLevel } from '../screens/game/kit/link-number/levels';
import { routes } from './paths';

const LinkNumberDemoRoute = () => {
  const navigate = useNavigate();

  return (
    <LinkNumberScreen
      level={basicLevel}
      onBack={() => navigate(routes.start)}
      demo
      onStartGame={() => navigate(routes.game)}
    />
  );
};

export default LinkNumberDemoRoute;
