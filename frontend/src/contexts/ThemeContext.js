import React, { createContext, useState } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create the provider
const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        background: '#f4f4f4',
        color: '#333',
        navBackground: '#333',
        navColor: '#fff',
        linkColor: '#1e90ff',
    });

    const toggleTheme = () => {
        setTheme(prevTheme => ({
            ...prevTheme,
            background: prevTheme.background === '#f4f4f4' ? '#333' : '#f4f4f4',
            color: prevTheme.color === '#333' ? '#f4f4f4' : '#333',
            navBackground: prevTheme.navBackground === '#333' ? '#fff' : '#333',
            navColor: prevTheme.navColor === '#fff' ? '#333' : '#fff',
        }));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider; // Export ThemeProvider as default
