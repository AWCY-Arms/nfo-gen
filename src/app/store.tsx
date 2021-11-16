import { configureStore } from '@reduxjs/toolkit';
import nfoReducer from '../features/nfo/nfoSlice';

const store = configureStore({
  reducer: {
    nfoConfig: nfoReducer,
  },
});

export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
