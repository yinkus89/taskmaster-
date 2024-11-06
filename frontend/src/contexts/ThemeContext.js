// src/context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    switch (location.pathname) {
      case '/login':
      case '/signup':
        setBackgroundColor('');
        break;
      case '/':
        setBackgroundColor('skyblue');
        break;
      case '/tasks/new':
        setBackgroundColor('grey');
        break;
      default:
        setBackgroundColor('white');
    }
  }, [location.pathname]);

  return (
    <ThemeContext.Provider value={{ backgroundColor }}>
      <div style={{ backgroundColor, minHeight: '100vh', padding: '20px' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
