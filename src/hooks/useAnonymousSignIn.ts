import { useMutation } from '@tanstack/react-query';
import { signInAnonymously } from '../services/authApi';
import { authStore } from '../stores/authStore';

export const useAnonymousSignIn = () => {
  const setToken = authStore((s) => s.setToken);
  return useMutation({
    mutationFn: signInAnonymously,
    onSuccess: ({ token }) => {
      setToken(token);
    },
  });
};

export default useAnonymousSignIn;
