// src/pages/HomePage.js
import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
    const { background, setTheme } = useTheme();

    useEffect(() => {
        setTheme('home');
    }, [setTheme]);

    return (
        <div style={{ backgroundColor: background, height: '100vh' }}>
            <h1>Home Page</h1>
        </div>
    );
};

export default HomePage;
