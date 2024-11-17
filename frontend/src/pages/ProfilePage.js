import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../contexts/ThemeContext'; // Corrected path
import { TailSpin } from 'react-loader-spinner'; // Import the spinner

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);  // Add error state to manage error messages
    const [loading, setLoading] = useState(false); // Add loading state for update and delete
    const [isEditing, setIsEditing] = useState(false); // To toggle edit mode
    const [newUsername, setNewUsername] = useState(''); // To store new username for update
    const [newEmail, setNewEmail] = useState(''); // To store new email for update
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
                setNewUsername(data.profile.username); // Set initial value for username
                setNewEmail(data.profile.email); // Set initial value for email
            } catch (error) {
                setError('Error fetching profile data. Please try again later.');
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const { data } = await axios.put(
                '/api/user/profile',
                { username: newUsername, email: newEmail },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setProfile(data.profile); // Update profile state with the updated profile
            setIsEditing(false); // Turn off editing mode
        } catch (error) {
            setError('Error updating profile. Please try again later.');
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProfile = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setLoading(true);
            try {
                await axios.delete('/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                localStorage.removeItem('token'); // Remove token from localStorage
                window.location.href = '/'; // Redirect to home page or login page
            } catch (error) {
                setError('Error deleting account. Please try again later.');
                console.error("Error deleting profile:", error);
            } finally {
                setLoading(false);
            }
        }
    };

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
            {isEditing ? (
                <div>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button onClick={handleUpdateProfile} disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button onClick={() => setIsEditing(false)} disabled={loading}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <button onClick={() => setIsEditing(true)} style={{ marginRight: '10px' }}>
                        Edit Profile
                    </button>
                    <button onClick={handleDeleteProfile} style={{ backgroundColor: 'red', color: 'white' }}>
                        Delete Profile
                    </button>
                </div>
            )}

            <button onClick={toggleTheme} style={{ marginTop: '20px', padding: '10px' }}>
                Toggle Theme
            </button>
        </div>
    );
};

export default ProfilePage;
