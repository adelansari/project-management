import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import authApi from "../api/authApi";

const Login = () => {
    // Hook to manage the browser navigation
    const navigate = useNavigate();

    // State variable to manage the loading state of the form
    const [loading, setLoading] = useState(false);

    // State variables to manage the error messages for username and password fields
    const [usernameErrText, setUsernameErrText] = useState("");
    const [passwordErrText, setPasswordErrText] = useState("");

    // Function to handle the form submission
    const handleSubmit = async (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Clear any previous error messages
        setUsernameErrText("");
        setPasswordErrText("");

        // Get the values of the form fields
        const data = new FormData(e.target);
        const username = data.get("username").trim();
        const password = data.get("password").trim();

        // Validate the form fields
        let err = false;
        if (username === "") {
            err = true;
            setUsernameErrText("Please fill this field");
        }
        if (password === "") {
            err = true;
            setPasswordErrText("Please fill this field");
        }

        // If there are any validation errors, return early and do not submit the form
        if (err) return;

        // Set the loading state to true to indicate that the form is being submitted
        setLoading(true);

        try {
            // Make a request to the server to log in the user
            const res = await authApi.login({ username, password });

            // Save the auth token to local storage
            localStorage.setItem("token", res.token);

            // Navigate to the home page
            navigate("/");
        } catch (err) {
            // Handle any errors that occurred during the login process
            const errors = err.data.errors;
            errors.forEach((e) => {
                if (e.param === "username") {
                    setUsernameErrText(e.msg);
                }
                if (e.param === "password") {
                    setPasswordErrText(e.msg);
                }
            });
        } finally {
            // Set the loading state to false after the form submission is complete
            setLoading(false);
        }
    };

    return (
        <>
            <Box component="form" sx={{ mt: 5 }} onSubmit={handleSubmit} noValidate>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    disabled={loading}
                    error={usernameErrText !== ""}
                    helperText={usernameErrText}
                    // sx={{ backgroundColor: 'orange'}}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    disabled={loading}
                    error={passwordErrText !== ""}
                    helperText={passwordErrText}
                    // sx={{ backgroundColor: 'lightblue' }}
                />
                <LoadingButton sx={{ mt: 3, mb: 2 }} variant="contained" fullWidth color="error" type="submit" loading={loading}>
                    Login
                </LoadingButton>
            </Box>
            <Button component={Link} to="/signup" sx={{ textTransform: "none" }}>
                Don't have an account? Signup
            </Button>
        </>
    );
};

export default Login;
