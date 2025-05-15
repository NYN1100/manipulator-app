// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import historyReducer from "./historySlice";
import manipulatorReducer from "./manipulatorSlice";

export const store = configureStore({
  reducer: {
    manipulator: manipulatorReducer,
    history: historyReducer,
  },
});

// ✅ This is your RootState type
export type RootState = ReturnType<typeof store.getState>;

// ✅ This is your AppDispatch type
export type AppDispatch = typeof store.dispatch;
