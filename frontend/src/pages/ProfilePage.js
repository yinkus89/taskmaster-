import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../contexts/ThemeContext'; // Corrected path
import { TailSpin } from 'react-loader-spinner'; // Import the spinner

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);  // Add error state to manage error messages
    const { theme, toggleTheme } = useContext(ThemeContext); // Access theme and toggleTheme

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(data.profile);
            } catch (error) {
                setError('Error fetching profile data. Please try again later.');
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfile();
    }, []);

    if (error) return <p>{error}</p>;  // Display error message if there is an error
    if (!profile) {  // Display loading spinner while fetching profile
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <TailSpin color="#00BFFF" height={50} width={50} />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: theme.background, color: theme.color, padding: '20px', borderRadius: '5px' }}>
            <h1>Profile Page</h1>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <button onClick={toggleTheme} style={{ marginTop: '20px', padding: '10px' }}>
                Toggle Theme
            </button>
        </div>
    );
};

export default ProfilePage;
