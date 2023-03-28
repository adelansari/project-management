// Import necessary dependencies and components
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseLine from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
    // Define MUI theme for the app
    const theme = createTheme({
        palette: { mode: "light" },
    });

    return (
        // Wrap the entire app with MUI ThemeProvider and BrowserRouter
        <ThemeProvider theme={theme}>
            <CssBaseLine />
            <BrowserRouter>
                <Routes>
                    {/* Define the auth routes using AuthLayout component */}
                    <Route path="/" element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                    {/* Define the app routes using AppLayout component */}
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
