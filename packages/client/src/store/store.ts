import { serverApi } from '@/api/server';
import { usersApi } from '@/api/users';
import { leaderboardApi } from '@/api/leaderboard';
import { configureStore } from '@reduxjs/toolkit';
import forumReducer from './forumSlice';
import authReducer from './authSlice';
import { authApi } from '@/api/auth';

export const store = configureStore({
  reducer: {
    forum: forumReducer,
    auth: authReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [serverApi.reducerPath]: serverApi.reducer,
    [leaderboardApi.reducerPath]: leaderboardApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      usersApi.middleware,
      serverApi.middleware,
      leaderboardApi.middleware,
      authApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
