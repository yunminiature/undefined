import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { serverApi } from '@/api/server';
import { usersApi } from '@/api/users';
import { leaderboardApi } from '@/api/leaderboard';
import forumReducer from './forumSlice';
import authReducer from './authSlice';
import { authApi } from '@/api/auth';
import { baseApi } from '@/api/baseApi';

export const rootReducer = combineReducers({
  forum: forumReducer,
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [serverApi.reducerPath]: serverApi.reducer,
  [leaderboardApi.reducerPath]: leaderboardApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const createAppStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        baseApi.middleware,
        usersApi.middleware,
        serverApi.middleware,
        leaderboardApi.middleware,
        authApi.middleware,
      ]),
  });

export type AppDispatch = ReturnType<typeof createAppStore>['dispatch'];
