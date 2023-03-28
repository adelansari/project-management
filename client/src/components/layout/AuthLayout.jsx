import { Container, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import assets from "../../assets";

const AuthLayout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Check authentication on component mount
    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await authUtils.isAuthenticated();
            if (!isAuth) {
                setLoading(false);
            } else {
                navigate("/");
            }
        };
        checkAuth();
    }, [navigate]);

    return (
        // Show loading spinner while authentication check is in progress
        loading ? (
            <Loading fullHeight />
        ) : (
            // Show auth layout when authentication check is completed
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <img src={assets.images.logoLight} style={{ width: "100px" }} alt="app logo" />
                    <Outlet />
                </Box>
            </Container>
        )
    );
};

export default AuthLayout;
