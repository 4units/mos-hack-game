import { useNavigate } from 'react-router';
import FaqScreen from '../screens/FaqScreen.tsx';
import { routes } from './paths.ts';

const FaqRoute = () => {
  const navigate = useNavigate();

  return <FaqScreen onBack={() => navigate(routes.game)} />;
};

export default FaqRoute;
