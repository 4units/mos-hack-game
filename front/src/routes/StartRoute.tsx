import { useNavigate } from 'react-router';
import StartScreen from '../screens/StartScreen.tsx';
import { routes } from './paths.ts';
import useAnonymousSignIn from '../hooks/useAnonymousSignIn.ts';

const StartRoute = () => {
  const navigate = useNavigate();
  const { mutateAsync } = useAnonymousSignIn();

  const handlePlay = async () => {
    console.log('[auth] "Как играть?" click');
    try {
      const response = await mutateAsync();
      console.log('[auth] mutateAsync resolved', response?.token);
      navigate(routes.linkNumberDemo);
    } catch {
      console.error('[auth] mutateAsync failed');
      navigate(routes.start);
    }
  };

  return <StartScreen onPlay={handlePlay} />;
};

export default StartRoute;
