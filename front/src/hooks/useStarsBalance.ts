import { useQuery } from '@tanstack/react-query';
import { getBalance } from '../services/balanceApi.ts';
import { useStarsStore } from '../stores/starsStore.ts';
import { useEffect } from 'react';

export const STARS_BALANCE_QUERY_KEY = ['stars', 'balance'];

export const useStarsBalance = () => {
  const query = useQuery({
    queryKey: STARS_BALANCE_QUERY_KEY,
    queryFn: getBalance,
    staleTime: 60_000,
  });

  const setBalance = useStarsStore((state) => state.setBalance);

  useEffect(() => {
    if (query.data?.soft_currency) {
      setBalance(query.data?.soft_currency);
    } else {
      setBalance(0);
    }
  }, [query.data?.soft_currency, setBalance]);

  return query;
};

export default useStarsBalance;
