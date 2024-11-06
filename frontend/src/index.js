// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext'; // Correct path
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter> {/* Only one Router here */}
    <ThemeProvider> {/* Wrap ThemeProvider around your app */}
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
