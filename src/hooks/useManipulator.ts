import { useState } from "react";

export interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 5;

export const useManipulator = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [samples, setSamples] = useState<Position[]>([
    { x: 2, y: 1 },
    { x: 4, y: 3 },
  ]);
  const [holding, setHolding] = useState<boolean>(false);

  const moveManipulator = async (commands: string, delay = 300) => {
    for (const cmd of commands) {
      setPosition((prev) => {
        let { x, y } = prev;
        switch (cmd) {
          case "Л":
            x = Math.max(0, x - 1);
            break;
          case "П":
            x = Math.min(GRID_SIZE - 1, x + 1);
            break;
          case "В":
            y = Math.max(0, y - 1);
            break;
          case "Н":
            y = Math.min(GRID_SIZE - 1, y + 1);
            break;
        }
        return { x, y };
      });

      if (cmd === "О") {
        // pick up sample
        const found = samples.find(
          (s) => s.x === position.x && s.y === position.y
        );
        if (found && !holding) {
          setSamples((prev) =>
            prev.filter((s) => !(s.x === position.x && s.y === position.y))
          );
          setHolding(true);
        }
      }

      if (cmd === "Б") {
        // drop sample
        if (holding) {
          setSamples((prev) => [...prev, { ...position }]);
          setHolding(false);
        }
      }

      await new Promise((res) => setTimeout(res, delay));
    }
  };

  return {
    position,
    moveManipulator,
    samples,
    holding,
    setPosition,
  };
};
