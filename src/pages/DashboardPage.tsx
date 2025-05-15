// src/pages/DashboardPage.tsx
import {
  Box,
  Button,
  Grid,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { addHistory } from "../store/slice/historySlice";
import { moveManipulator } from "../store/slice/manipulatorSlice";
import type { RootState } from "../store/slice/store";
import type { CommandHistory } from "../types/CommandHistory";
import { optimizeCommandsRLE } from "../utils/optimize";

const DashboardPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("isAuth") !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const dispatch = useDispatch();
  const { position, samples } = useSelector(
    (state: RootState) => state.manipulator
  );
  //@ts-ignore
  const history = useSelector((state: RootState) => state.history.records);

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      input: "",
    },
  });
  const input = watch("input");

  const [optimized, setOptimized] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const gridWidth = 5;
  const gridHeight = 5;

  const handleOptimize = () => {
    const result = optimizeCommandsRLE(input.toUpperCase());
    setOptimized(result);
  };

  const handleRun = () => {
    const raw = input.toUpperCase();
    const optimizedString = optimized || optimizeCommandsRLE(raw);

    const beforeSamples = JSON.stringify(samples);

    dispatch(moveManipulator(optimizedString));

    // TODO: If you update samples in your slice on moveManipulator, fetch updated samples here:
    const afterSamples = beforeSamples; // Replace with real after state if available

    const historyRecord: CommandHistory = {
      id: uuidv4(),
      date: new Date().toLocaleString(),
      original: raw,
      optimized: optimizedString,
      samplesBefore: beforeSamples,
      samplesAfter: afterSamples,
    };

    dispatch(addHistory(historyRecord));
    setSnackbarOpen(true);
    reset();
  };

  return (
    <Box p={4} component="form" onSubmit={handleSubmit(handleRun)}>
      <Typography variant="h4" mb={4}>
        Панель управления манипулятором
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid>
          <TextField fullWidth label="Введите команды" {...register("input")} />
        </Grid>
        <Grid>
          <Button variant="outlined" onClick={handleOptimize} type="button">
            Оптимизировать
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit">
            Запустить
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Typography variant="body1">
          Оптимизированная команда: <strong>{optimized}</strong>
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Позиция манипулятора и сетка</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridWidth}, 50px)`,
            gridTemplateRows: `repeat(${gridHeight}, 50px)`,
            gap: "4px",
            mt: 1,
          }}
        >
          {[...Array(gridWidth * gridHeight)].map((_, index) => {
            const x = index % gridWidth;
            const y = Math.floor(index / gridWidth);
            const isManipulatorHere = position.x === x && position.y === y;
            const hasSample = samples.some((s) => s.x === x && s.y === y);
            return (
              <Box
                key={index}
                sx={{
                  width: 50,
                  height: 50,
                  border: "1px solid black",
                  backgroundColor: isManipulatorHere
                    ? "blue"
                    : hasSample
                    ? "orange"
                    : "white",
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">История команд</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Исходная</TableCell>
              <TableCell>Оптимизированная</TableCell>
              <TableCell>До</TableCell>
              <TableCell>После</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.original}</TableCell>
                <TableCell>{record.optimized}</TableCell>
                <TableCell>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                    {record.samplesBefore}
                  </pre>
                </TableCell>
                <TableCell>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                    {record.samplesAfter}
                  </pre>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Операция выполнена успешно!"
      />
    </Box>
  );
};

export default DashboardPage;
