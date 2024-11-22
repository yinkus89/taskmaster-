import React, { useState } from "react";
import axios from "axios";

const SignupPage = () => {
  const [username, setUsername] = useState(""); // Use username field instead of name
  const [email, setEmail] = useState(""); // Email field
  const [password, setPassword] = useState(""); // Password field
  const [message, setMessage] = useState(""); // To show message to the user
  const [loading, setLoading] = useState(false); // To show loading state

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation to check if username is at least 3 characters
    if (username.trim().length < 3) {
      setMessage("Username must be at least 3 characters long");
      return;
    }

    // Clear previous message if any
    setMessage("");
    // Set loading to true while making the request
    setLoading(true);

    console.log("Sending signup request with:", { username, email, password }); // Log data being sent

    try {
      // Sending data to backend
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        username, // Changed to username
        email,
        password,
      });

      // Show success message upon successful signup
      setMessage("Signup successful!");
      console.log("User signed up:", response.data);
    } catch (error) {
      console.error("Error signing up user:", error);
      if (error.response) {
        // Display error message from backend
        setMessage(error.response.data.message || "Signup failed due to validation error");
      } else {
        // Network or server unavailable error
        setMessage("Network error or server unavailable");
      }
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignupPage;
