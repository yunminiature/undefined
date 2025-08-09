import { isBaseQueryError } from '../../utils';

export const getAvatarErrorMessage = (err: unknown): string => {
  if (isBaseQueryError(err)) {
    if (typeof err.data === 'string') return err.data;
    if (typeof err.data === 'object' && err.data && 'reason' in err.data) {
      return (err.data as { reason?: string }).reason ?? 'Failed to change avatar';
    }
    return 'Failed to change avatar';
  }
  if (err instanceof Error) return err.message;
  return 'Failed to change avatar';
};
