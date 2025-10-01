import { useNavigate } from 'react-router';
import StartScreen from '../screens/StartScreen';
import { routes } from './paths';

const StartRoute = () => {
  const navigate = useNavigate();

  return <StartScreen onPlay={() => navigate(routes.linkNumberDemo)} />;
};

export default StartRoute;
