import { isBaseQueryError } from '../utils';

export const getErrorMessage = (err: unknown): string => {
  if (isBaseQueryError(err)) {
    if (typeof err.data === 'string') return err.data;
    if (typeof err.data === 'object' && err.data && 'message' in err.data) {
      return (err.data as { message?: string }).message ?? 'Failed to change password';
    }
    return 'Failed to change password';
  }

  if (err instanceof Error) return err.message;

  return 'Failed to change password';
};
