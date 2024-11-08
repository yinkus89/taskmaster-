import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Update with your deployed backend URL
});

export default api;
