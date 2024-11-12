import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Update this if deploying
  withCredentials: true, // Ensures cookies are sent with requests
});

export default api;
