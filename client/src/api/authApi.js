import axiosClient from "./axiosClient";

// define an object that holds functions to interact with authentication API endpoints
const authApi = {
    // the signup function makes a POST request to the auth/signup endpoint with provided params
    signup: (params) => axiosClient.post("auth/signup", params),
    // the login function makes a POST request to the auth/login endpoint with provided params
    login: (params) => axiosClient.post("auth/login", params),
    // the verifyToken function makes a POST request to the auth/verify-token endpoint
    // this endpoint does not require any parameters to be passed in
    verifyToken: () => axiosClient.post("auth/verify-token"),
};

export default authApi;
