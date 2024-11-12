import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

const HomePage = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    // Redirect to login if no token
                    history.push('/login');
                    return;
                }

                const response = await axios.get('/api/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(response.data);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError('Failed to load tasks. Please try again later.');
            }
        };

        fetchTasks();
    }, [history]);

    return (
        <div>
            <h1>Task List</h1>
            {error && <p>{error}</p>} {/* Show error if tasks couldn't be loaded */}
            <ul>
                {tasks.length === 0 ? (
                    <p>No tasks available.</p>
                ) : (
                    tasks.map((task) => (
                        <li key={task._id}>
                            <Link to={`/task/${task._id}`}>{task.title}</Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default HomePage;
