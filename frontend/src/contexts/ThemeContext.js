import React, { createContext, useState } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create the provider
const ThemeProvider = ({ children }) => {
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

    const [theme, setTheme] = useState(lightTheme);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === lightTheme ? darkTheme : lightTheme));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
