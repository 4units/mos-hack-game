import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeLineGameLevel, type CompleteLineLevelResponse } from '../services/linkNumberApi';
import { useStarsStore } from '../stores/starsStore';
import { STARS_BALANCE_QUERY_KEY } from './useStarsBalance';
import { LINK_NUMBER_LEVEL_QUERY_KEY } from './useLinkNumberLevel';

export const useCompleteLineLevel = () => {
  const setBalance = useStarsStore((state) => state.setBalance);
  const queryClient = useQueryClient();

  return useMutation<CompleteLineLevelResponse, unknown, { time_since_start: number }>({
    mutationFn: completeLineGameLevel,
    onSuccess: ({ soft_currency }) => {
      setBalance(soft_currency);
      queryClient.invalidateQueries({ queryKey: STARS_BALANCE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LINK_NUMBER_LEVEL_QUERY_KEY });
    },
  });
};

export default useCompleteLineLevel;
