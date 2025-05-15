import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(localStorage.getItem("isAuth") === "true");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={isAuth ? <DashboardPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
