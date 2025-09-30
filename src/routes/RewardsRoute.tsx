import { useNavigate } from 'react-router';
import RewardsScreen from '../screens/RewardsScreen';
import { routes } from './paths';

const RewardsRoute = () => {
  const navigate = useNavigate();

  return <RewardsScreen onBack={() => navigate(routes.game)} />;
};

export default RewardsRoute;
