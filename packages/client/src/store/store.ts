import { serverApi } from '@/api/server';
import { usersApi } from '@/api/users';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [serverApi.reducerPath]: serverApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([usersApi.middleware, serverApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
