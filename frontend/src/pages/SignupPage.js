import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Importing the configured API instance
import { ThemeContext } from "../contexts/ThemeContext"; // Import ThemeContext

function SignupPage() {
    const { theme } = useContext(ThemeContext); // Access theme from context
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !username || !password) {
            setError('All fields are required');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/signup', { email, username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/'); // Redirect to tasks page
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: theme.background, color: theme.color, padding: '20px', borderRadius: '5px' }}>
            <h1>Sign Up</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        style={{ padding: '10px', margin: '10px 0', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                        style={{ padding: '10px', margin: '10px 0', width: '100%' }}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        style={{ padding: '10px', margin: '10px 0', width: '100%' }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        padding: '10px',
                        backgroundColor: theme.linkColor,
                        color: theme.navColor,
                        width: '100%',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}

export default SignupPage;
