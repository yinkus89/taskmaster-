import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom'; // Use Link from react-router-dom for navigation

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <nav style={{ backgroundColor: theme.navBackground, color: theme.navColor }}>
            <ul style={styles.navList}>
                {/* Home Link */}
                <li>
                    <Link to="/" style={{ color: theme.linkColor }}>Home</Link>
                </li>
                {/* Authentication Links */}
                <li>
                    <Link to="/login" style={{ color: theme.linkColor }}>Login</Link>
                </li>
                <li>
                    <Link to="/signup" style={{ color: theme.linkColor }}>Sign Up</Link>
                </li>
                {/* Task Links */}
                <li>
                    <Link to="/tasks" style={{ color: theme.linkColor }}>My Tasks</Link>
                </li>
                <li>
                    <Link to="/tasks/public" style={{ color: theme.linkColor }}>Public Tasks</Link>
                </li>
                {/* Theme Toggle Button */}
                <li>
                    <button onClick={toggleTheme} style={{ color: theme.linkColor, background: 'transparent', border: 'none' }}>
                        Toggle Theme
                    </button>
                </li>
            </ul>
        </nav>
    );
};

// Additional styles for the navigation list
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
