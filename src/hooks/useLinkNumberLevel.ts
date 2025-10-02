import { useQuery } from '@tanstack/react-query';
import { getLineGameLevel } from '../services/linkNumberApi';

export const LINK_NUMBER_LEVEL_QUERY_KEY = ['line', 'level', 'current'];

export const useLinkNumberLevel = () =>
  useQuery({
    queryKey: LINK_NUMBER_LEVEL_QUERY_KEY,
    queryFn: getLineGameLevel,
  });

export default useLinkNumberLevel;
