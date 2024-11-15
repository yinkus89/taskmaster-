import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext"; // Import the ThemeContext

const Navbar = () => {
  const { theme } = useContext(ThemeContext); // Access theme context for styling

  return (
    <nav
      style={{ backgroundColor: theme.navBackground, color: theme.navColor }}
    >
      <ul>
        <li>
          <Link to="/" style={{ color: theme.linkColor }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/login" style={{ color: theme.linkColor }}>
            Login
          </Link>
        </li>
        <li>
          <Link to="/signup" style={{ color: theme.linkColor }}>
            Sign Up
          </Link>
        </li>
        <li>
          <Link to="/tasks" style={{ color: theme.linkColor }}>
            Tasks
          </Link>
        </li>
        <li>
          <Link to="/tasks/new" style={{ color: theme.linkColor }}>
            New Task
          </Link>
        </li>
        <li>
          <Link to="/about" style={{ color: theme.linkColor }}>
            About Us
          </Link>
        </li>{" "}
        {/* Link to About Us */}
      </ul>
    </nav>
  );
};

export default Navbar;
