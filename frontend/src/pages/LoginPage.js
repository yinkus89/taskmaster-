import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { ThemeContext } from '../contexts/ThemeContext'; 

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login', 
                { email, password },
                { withCredentials: true }
            );

            const userData = response.data;

            localStorage.setItem('token', userData.token); 
            localStorage.setItem('user', JSON.stringify(userData));

            // Redirect to the homepage after successful login
            navigate('/');  // Update to redirect to the homepage
        } catch (err) {
            console.error(err);
            if (err.response) {
                setError(err.response.data.message || 'Something went wrong!');
            } else {
                setError('Network error. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="login-container" 
            style={{ 
                backgroundColor: theme.background, 
                color: theme.color, 
                padding: '20px', 
                maxWidth: '400px', 
                margin: 'auto', 
                textAlign: 'center' 
            }}
        >
            <h2 style={{ color: theme.headingColor }}>Login</h2>
            {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email" style={{ color: theme.color }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ 
                            backgroundColor: theme.background, 
                            color: theme.color, 
                            border: `1px solid ${theme.color}`, 
                            padding: '10px', 
                            width: '100%' 
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="password" style={{ color: theme.color }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ 
                            backgroundColor: theme.background, 
                            color: theme.color, 
                            border: `1px solid ${theme.color}`, 
                            padding: '10px', 
                            width: '100%' 
                        }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                        backgroundColor: theme.linkColor, 
                        color: theme.color, 
                        padding: '10px 20px', 
                        cursor: 'pointer', 
                        border: 'none' 
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <button onClick={toggleTheme} style={{ 
                backgroundColor: theme.linkColor, 
                color: theme.color, 
                padding: '10px', 
                marginTop: '10px', 
                border: 'none', 
                cursor: 'pointer' 
            }}>
                Toggle Theme
            </button>
        </div>
    );
}

export default LoginPage;
