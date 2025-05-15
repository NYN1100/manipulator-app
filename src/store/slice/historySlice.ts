// src/store/slices/historySlice.ts
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { CommandHistory } from "../../types/CommandHistory";

interface HistoryState {
  records: CommandHistory[];
}

const initialState: HistoryState = {
  records: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addHistory: (state, action: PayloadAction<CommandHistory>) => {
      state.records.unshift(action.payload);
    },
  },
});

export const { addHistory } = historySlice.actions;
export default historySlice.reducer;
