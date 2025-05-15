// src/store/slices/manipulatorSlice.ts

import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface Position {
  x: number;
  y: number;
}

interface Sample {
  x: number;
  y: number;
}

interface ManipulatorState {
  position: Position;
  hasSample: boolean;
  samples: Sample[];
}

const initialState: ManipulatorState = {
  position: { x: 0, y: 0 },
  hasSample: false,
  samples: [
    { x: 2, y: 1 },
    { x: 3, y: 3 },
  ],
};

const manipulatorSlice = createSlice({
  name: "manipulator",
  initialState,
  reducers: {
    moveManipulator: (state, action: PayloadAction<string>) => {
      const commands = action.payload.split("");

      commands.forEach((cmd) => {
        switch (cmd) {
          case "Л": // Left
            state.position.x = Math.max(0, state.position.x - 1);
            break;
          case "П": // Right
            state.position.x += 1;
            break;
          case "В": // Up
            state.position.y = Math.max(0, state.position.y - 1);
            break;
          case "Н": // Down
            state.position.y += 1;
            break;
          case "О": // Pick up
            const sampleIndex = state.samples.findIndex(
              (s) => s.x === state.position.x && s.y === state.position.y
            );
            if (sampleIndex !== -1 && !state.hasSample) {
              state.samples.splice(sampleIndex, 1);
              state.hasSample = true;
            }
            break;
          case "Б": // Drop
            if (state.hasSample) {
              state.samples.push({ ...state.position });
              state.hasSample = false;
            }
            break;
          default:
            break;
        }
      });
    },
  },
});

export const { moveManipulator } = manipulatorSlice.actions;
export default manipulatorSlice.reducer;
