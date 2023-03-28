import axios from "axios";
import queryString from "query-string";

// Base URL for the API
const baseUrl = "http://127.0.0.1:5000/api/v1/";

// Function to get the bearer token from local storage
const getToken = () => localStorage.getItem("token");

// Create a new Axios client with some default settings
const axiosClient = axios.create({
    baseURL: baseUrl, // Set the base URL for all requests
    paramsSerializer: (params) => queryString.stringify({ params }), // Serialize query params
});

// Add an interceptor to add the authorization header to all requests
axiosClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
});

// Add an interceptor to the response to return only the data if it exists
axiosClient.interceptors.response.use(
    (response) => {
        // Extract the response data from the Axios response object
        if (response && response.data) return response.data;
        return response;
    },
    (error) => {
        // Handle errors by alerting if there is no response or throwing the error response
        if (!error.response) {
            return alert(error);
        }
        // Handle HTTP errors
        throw error.response;
    }
);

export default axiosClient;
