import { useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./css/custom-scrollbar.css";
import CssBaseLine from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Button, Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

function App() {
    // Defining state variable for theme mode
    const [themeMode, setThemeMode] = useState("dark");
  
    // Creating MUI theme with current theme mode
    const theme = createTheme({
      palette: { mode: themeMode },
    });
  
    // Function to handle toggling of theme mode
    const handleThemeToggle = () => {
      setThemeMode((prevThemeMode) => (prevThemeMode === "dark" ? "light" : "dark"));
    };
  
    return (
      <ThemeProvider theme={theme}>
        <CssBaseLine />
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            margin: "1rem",
          }}
        >
          <Tooltip title="Toggle Theme">
            <Button onClick={handleThemeToggle}>Light 🌞/ Dark 🌚</Button>
          </Tooltip>
        </Box>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="boards" element={<Home />} />
              <Route path="boards/:boardId" element={<Board />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
  
  export default App;
