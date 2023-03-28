import axiosClient from "./axiosClient";

/**
 * Provides methods to interact with the authentication API.
 */
const authApi = {
    /**
     * Registers a new user with the given information.
     * @param {object} params - An object containing the user's username, password, and confirmPassword.
     * @returns {Promise} A Promise that resolves with the response data or rejects with an error.
     */
    signup: (params) => axiosClient.post("auth/signup", params),

    /**
     * Logs in a user with the given username and password.
     * @param {object} params - An object containing the user's username and password.
     * @returns {Promise} A Promise that resolves with the response data or rejects with an error.
     */
    login: (params) => axiosClient.post("auth/login", params),

    /**
     * Verifies the user's access token.
     * @returns {Promise} A Promise that resolves with the response data or rejects with an error.
     */
    verifyToken: () => axiosClient.post("auth/verify-token"),
};

export default authApi;
