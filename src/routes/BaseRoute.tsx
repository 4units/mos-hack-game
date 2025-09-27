import { useNavigate } from 'react-router';
import BaseScreen from '../screens/BaseScreen';
import { routes } from './paths';

const BaseRoute = () => {
  const navigate = useNavigate();

  return <BaseScreen onBack={() => navigate(routes.game)} />;
};

export default BaseRoute;
