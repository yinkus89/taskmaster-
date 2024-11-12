import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ThemeProvider from './contexts/ThemeContext'; // Ensure the correct path to ThemeContext
import './App.css'; // Import your styles

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter> {/* Wraps your app to enable routing */}
    <ThemeProvider> {/* Wrap ThemeProvider around your app for theme management */}
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
