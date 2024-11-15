import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../contexts/ThemeContext';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            
            // Redirect to login if token is missing
            if (!token) {
                setError("Authentication required. Please log in.");
                return;
            }
        
            try {
                setLoading(true);
                const { data } = await axios.get('http://localhost:5000/api/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTasks(data.tasks || []); // Fallback to an empty array if tasks are not defined
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setError("Unauthorized access. Please log in again.");
                } else {
                    setError("Error fetching tasks. Please try again later.");
                }
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchTasks();
    }, []);

    // Display error if authorization fails
    if (error) return <p>{error}</p>;

    return (
        <div style={{ backgroundColor: theme.background, color: theme.color, padding: '20px' }}>
            <h1>Task Page</h1>
            <button onClick={toggleTheme}>Toggle Theme</button>
            
            {loading ? (
                <p>Loading...</p>
            ) : (
                tasks && tasks.length > 0 ? ( // Add a check for tasks
                    <ul>
                        {tasks.map(task => (
                            <li key={task._id}>{task.title}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No tasks available.</p>
                )
            )}
        </div>
    );
};

export default TaskPage;
