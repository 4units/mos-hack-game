import { useQuery } from '@tanstack/react-query';
import { getLineGameLevel } from '../services/linkNumberApi';
import { useLevelStore } from '../stores/levelStore';
import { useEffect } from 'react';

export const LINK_NUMBER_LEVEL_QUERY_KEY = ['line', 'level', 'current'];

export const useLinkNumberLevel = () => {
  const query = useQuery({
    queryKey: LINK_NUMBER_LEVEL_QUERY_KEY,
    queryFn: getLineGameLevel,
  });

  const setCurrentLevel = useLevelStore((state) => state.setCurrentLevel);

  useEffect(() => {
    if (query.data?.level_num) {
      setCurrentLevel(query.data?.level_num);
    } else {
      setCurrentLevel(0);
    }
  }, [query.data?.level_num, setCurrentLevel]);

  return query;
};

export default useLinkNumberLevel;
