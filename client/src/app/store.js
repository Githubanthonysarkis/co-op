import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import groupSlice from '../features/groups/groupSlice';
import currentGroupSlice from '../features/groups/currentGroupSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    groups: groupSlice,
    currentGroup: currentGroupSlice
  },
});
