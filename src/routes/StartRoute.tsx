import { useNavigate } from 'react-router';
import StartScreen from '../screens/StartScreen';
import { routes } from './paths';
import useAnonymousSignIn from '../hooks/useAnonymousSignIn';

const StartRoute = () => {
  const navigate = useNavigate();
  const { mutate } = useAnonymousSignIn();

  const handlePlay = () => {
    mutate(undefined, {
      onSuccess: () => navigate(routes.game),
      onError: () => navigate(routes.start),
    });
  };

  return <StartScreen onPlay={handlePlay} />;
};

export default StartRoute;
