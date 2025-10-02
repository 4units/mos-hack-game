import { useMutation } from '@tanstack/react-query';
import { getLineGameHint } from '../services/linkNumberApi';

export const useLineGameHint = () =>
  useMutation({
    mutationFn: getLineGameHint,
  });

export default useLineGameHint;
