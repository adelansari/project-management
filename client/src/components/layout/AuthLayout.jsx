import { Container, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import assets from "../../assets";
import { useTheme } from "@mui/material/styles";

const AuthLayout = () => {
    // Getting navigate function from useNavigate hook
    const navigate = useNavigate();
    // Defining loading state variable
    const [loading, setLoading] = useState(true);
    // Getting current theme mode from MUI theme
    const theme = useTheme();
    const themeMode = theme.palette.mode;

    // Using useEffect hook to check authentication on mount
    useEffect(() => {
        // Defining checkAuth function to check authentication
        const checkAuth = async () => {
            // Checking if user is authenticated using authUtils
            const isAuth = await authUtils.isAuthenticated();
            // If user is not authenticated, set loading state to false
            if (!isAuth) {
                setLoading(false);
            } else {
                // If user is authenticated, navigate to home page
                navigate("/");
            }
        };
        // Calling checkAuth function
        checkAuth();
    }, [navigate]);

    // Returning JSX code for AuthLayout component
    return (
        // If loading state is true, render Loading component
        loading ? (
            <Loading fullHeight />
        ) : (
            // If loading state is false, render auth layout with logo and Outlet component
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <img src={themeMode === "dark" ? assets.images.logoDark : assets.images.logoLight} style={{ width: "200px" }} alt="app logo" />
                    <Outlet />
                </Box>
            </Container>
        )
    );
};

export default AuthLayout;
