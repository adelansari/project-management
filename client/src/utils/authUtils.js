import authApi from "../api/authApi";

// This object contains utility functions related to authentication
const authUtils = {
    // This function checks if the user is authenticated by verifying their token with the server
    isAuthenticated: async () => {
        // Get the token from local storage
        const token = localStorage.getItem("token");
        // If there is no token, the user is not authenticated
        if (!token) return false;
        try {
            // Verify the token by making a request to the server
            const res = await authApi.verifyToken();
            // If the request is successful, return the user data
            return res.user;
        } catch {
            // If there is an error (e.g. the token is invalid), the user is not authenticated
            return false;
        }
    },
};

export default authUtils;
