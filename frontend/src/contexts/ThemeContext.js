import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create the provider
const ThemeProvider = ({ children }) => {
    // Define the light and dark theme settings
    const lightTheme = {
        background: '#f4f4f4',
        color: '#333',
        navBackground: '#333',
        navColor: '#fff',
        linkColor: '#1e90ff',
        headingColor: '#333',
    };

    const darkTheme = {
        background: '#333',
        color: '#f4f4f4',
        navBackground: '#fff',
        navColor: '#333',
        linkColor: '#1e90ff',
        headingColor: '#f4f4f4',
    };

    // Check localStorage for saved theme on initial load
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme ? JSON.parse(savedTheme) : lightTheme;

    // State to store the current theme
    const [theme, setTheme] = useState(initialTheme);

    // Toggle the theme between light and dark modes
    const toggleTheme = () => {
        const newTheme = theme === lightTheme ? darkTheme : lightTheme;
        setTheme(newTheme);
        // Save the selected theme in localStorage
        localStorage.setItem('theme', JSON.stringify(newTheme));
    };

    // Optional: You could add useEffect to apply the theme on the body or specific elements globally
    useEffect(() => {
        document.body.style.backgroundColor = theme.background;
        document.body.style.color = theme.color;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
