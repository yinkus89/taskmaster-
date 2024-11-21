import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Handle routing
import App from './App'; // Import the main App component
import ThemeProvider from './contexts/ThemeContext'; // Import ThemeProvider to manage themes
import './App.css'; // Import global CSS styles

// Create a root element to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root element
root.render(
  <BrowserRouter>
    <ThemeProvider> {/* Wrapping the entire app in ThemeProvider for theme context */}
      <App /> {/* Your main application */}
    </ThemeProvider>
  </BrowserRouter>
);
