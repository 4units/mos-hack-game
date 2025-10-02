import { useNavigate } from 'react-router';
import FaqScreen from '../screens/FaqScreen';
import { routes } from './paths';

const FaqRoute = () => {
  const navigate = useNavigate();

  return <FaqScreen onBack={() => navigate(routes.game)} />;
};

export default FaqRoute;
