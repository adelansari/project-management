import axios from "axios";
import queryString from "query-string";

const baseURL = "http://127.0.0.1:5000/api/v1/"; // for local testing
// const baseURL = "http://project-management-api.vercel.app/api/v1/";
const getToken = () => localStorage.getItem("token");

// Create a new instance of axios with baseURL and paramsSerializer options
const axiosClient = axios.create({
    baseURL: baseURL,
    paramsSerializer: (params) => queryString.stringify(params),
});

// Add an interceptor to add authorization header to all requests
axiosClient.interceptors.request.use((config) => {
    // Get the token from local storage
    const token = getToken();
    // If token exists, add it to headers
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// Add an interceptor to transform response data before returning it
axiosClient.interceptors.response.use(
    (response) => {
        // If response contains data, return only the data
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        // If there is no response, show alert
        if (!error.response) {
            alert(error);
            return Promise.reject(error);
        }
        // Otherwise, throw error response
        return Promise.reject(error.response);
    }
);

export default axiosClient;
