import { configureStore } from '@reduxjs/toolkit';
import nfoReducer from '../features/nfo/nfoSlice';
import appReducer from '../features/app/appSlice';

const store = configureStore({
  reducer: {
    nfoConfig: nfoReducer,
    app: appReducer,
  },
});

export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
