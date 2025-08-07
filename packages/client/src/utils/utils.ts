import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const isBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error;
