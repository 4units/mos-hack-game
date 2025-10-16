import { useMutation } from '@tanstack/react-query';
import { signInAnonymously } from '../services/authApi.ts';
import { authStore } from '../stores/authStore.ts';

export const useAnonymousSignIn = () => {
  const setToken = authStore((s) => s.setToken);
  return useMutation({
    mutationFn: signInAnonymously,
    onMutate: () => {
      console.log('[auth] mutate start');
    },
    onSuccess: ({ token }) => {
      console.log('[auth] mutate success', token);
      setToken(token);
    },
    onError: (error) => {
      console.error('[auth] mutate error', error);
    },
    onSettled: () => {
      console.log('[auth] mutate settled');
    },
  });
};

export default useAnonymousSignIn;
