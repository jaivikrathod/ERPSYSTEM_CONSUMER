import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// Centralised Redux store configuration
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
