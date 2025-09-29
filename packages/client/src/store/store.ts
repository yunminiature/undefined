import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { serverApi } from '@/api/server';
import { usersApi } from '@/api/users';
import { leaderboardApi } from '@/api/leaderboard';
import { forumApi } from '@/api/forum';
import authReducer from './authSlice';
import { authApi } from '@/api/auth';
import { baseApi } from '@/api/baseApi';

export const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [serverApi.reducerPath]: serverApi.reducer,
  [leaderboardApi.reducerPath]: leaderboardApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [forumApi.reducerPath]: forumApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const createAppStore = (preloadedState?: Partial<RootState>, isSSR?: boolean) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
    middleware: (getDefaultMiddleware) => {
      // В SSR режиме не добавляем RTK Query middleware для избежания проблем с hooks
      if (isSSR) {
        return getDefaultMiddleware({
          serializableCheck: false, // Отключаем проверки для SSR
        });
      }

      return getDefaultMiddleware().concat([
        baseApi.middleware,
        usersApi.middleware,
        serverApi.middleware,
        leaderboardApi.middleware,
        authApi.middleware,
        forumApi.middleware,
      ]);
    },
  });

export type AppDispatch = ReturnType<typeof createAppStore>['dispatch'];
