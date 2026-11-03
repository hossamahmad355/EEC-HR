import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import hrReducer, { HR_STORAGE_KEY } from './hrSlice';

export const store = configureStore({
  reducer: {
    hr: hrReducer,
  },
});

// Auto-save state to localStorage on every state update
store.subscribe(() => {
  try {
    const state = store.getState().hr;
    localStorage.setItem(HR_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not persist HR state to localStorage:', err);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
