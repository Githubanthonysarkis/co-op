import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import groupSlice from "../features/groups/groupSlice";
import currentGroupSlice from "../features/groups/currentGroupSlice";

// create redux store for global state management
export const store = configureStore({
  reducer: {
    auth: authSlice,
    groups: groupSlice,
    currentGroup: currentGroupSlice,
  },
});
