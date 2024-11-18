// src/components/Navbar.js
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <nav style={{ backgroundColor: theme.navBackground, color: theme.navColor }}>
            <ul style={styles.navList}>
                <li>
                    <Link to="/" style={{ color: theme.linkColor }}>Home</Link>
                </li>
                <li>
                    <Link to="/login" style={{ color: theme.linkColor }}>Login</Link>
                </li>
                <li>
                    <Link to="/signup" style={{ color: theme.linkColor }}>Sign Up</Link>
                </li>
                <li>
                    <Link to="/tasks" style={{ color: theme.linkColor }}>My Tasks</Link>
                </li>
                <li>
                    <Link to="/tasks/public" style={{ color: theme.linkColor }}>Public Tasks</Link>
                </li>
                <li>
                    <Link to="/profile" style={{ color: theme.linkColor }}>Profile</Link>
                </li>
                <li>
                    <Link to="/aboutus" style={{ color: theme.linkColor }}>About Us</Link>
                </li>
                <li>
                    <button onClick={toggleTheme} style={{ color: theme.linkColor, background: 'transparent', border: 'none' }}>
                        Toggle Theme
                    </button>
                </li>
            </ul>
        </nav>
    );
};

const styles = {
    navList: {
        listStyleType: 'none',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px',
        margin: 0,
    },
};

export default Navbar;
