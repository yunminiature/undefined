import { usersService } from '@/api/users';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [usersService.reducerPath]: usersService.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([usersService.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
