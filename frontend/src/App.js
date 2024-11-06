import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import Footer from './component/Footer.js';
import Navbar from './component/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TaskListPage from './component/TaskListPage';
import TaskFormPage from './pages/TaskFormPage';


function App() {
    return (
        <>
            <Header />
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<TaskListPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/tasks/new" element={<TaskFormPage />} />
                </Routes>
            </div>
            <Footer />
        </>
    );
}

export default App;
