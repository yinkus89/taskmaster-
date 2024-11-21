import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5001", // Replace with your backend base URL
});

// Add a request interceptor to attach the token to the request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // If the token exists, attach it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
