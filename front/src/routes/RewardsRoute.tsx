import { useNavigate } from 'react-router';
import RewardsScreen from '../screens/RewardsScreen.tsx';
import { routes } from './paths.ts';

const RewardsRoute = () => {
  const navigate = useNavigate();

  return <RewardsScreen onBack={() => navigate(routes.game)} />;
};

export default RewardsRoute;
