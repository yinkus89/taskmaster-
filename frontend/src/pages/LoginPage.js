import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Assuming api.js is in the same directory

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token); // Store token in local storage
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      // Handle error (e.g., invalid credentials)
      setError(err.response?.data?.message || "Invalid credentials");
      console.log(err.response?.data); // Log detailed error message
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
