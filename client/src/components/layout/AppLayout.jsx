import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import Sidebar from "../common/Sidebar";
import { setUser } from '../../redux/features/userSlice'

const AppLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // check if user is authenticated
            const user = await authUtils.isAuthenticated();
            if (!user) {
                // if user is not authenticated, redirect to login page
                navigate("/login");
            } else {
                // if user is authenticated, save user to Redux store and stop loading
                dispatch(setUser(user))
                setLoading(false);
            }
        };
        checkAuth();
    }, [dispatch, navigate]);

    return loading ? (
        // show loading component while waiting for user authentication
        <Loading fullHeight />
    ) : (
        <Box
            sx={{
                display: "flex",
            }}
        >
            <Sidebar />
            <Box
                sx={{
                    flexGrow: 1,
                    p: 1,
                    width: "max-content",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default AppLayout;
