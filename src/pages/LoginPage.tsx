import { Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      localStorage.setItem("isAuth", "true");
      navigate("/");
    } else {
      alert("Неверный логин или пароль");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isAuth") === "true") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h5" mb={2}>
        Вход
      </Typography>
      <TextField
        label="Логин"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Пароль"
        fullWidth
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleLogin}
        sx={{ mt: 2 }}
      >
        Войти
      </Button>
    </Container>
  );
}
