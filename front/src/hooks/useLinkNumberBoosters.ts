import { useMutation, useQueryClient } from '@tanstack/react-query';
import { spendHintBooster, spendTimeStopBooster } from '../services/linkNumberApi.ts';
import { STARS_BALANCE_QUERY_KEY } from './useStarsBalance.ts';

export const useSpendTimeStopBooster = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: spendTimeStopBooster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STARS_BALANCE_QUERY_KEY });
    },
  });
};

export const useSpendHintBooster = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: spendHintBooster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STARS_BALANCE_QUERY_KEY });
    },
  });
};

export default useSpendTimeStopBooster;
