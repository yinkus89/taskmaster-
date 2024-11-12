import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../contexts/ThemeContext'; // Import ThemeContext

const TaskDetailsPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const { theme } = useContext(ThemeContext); // Access current theme

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const response = await axios.get(`/api/tasks/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setTask(response.data);
            } catch (err) {
                console.error('Error fetching task details:', err);
            }
        };

        fetchTaskDetails();
    }, [taskId]);

    if (!task) return <p>Loading...</p>;

    return (
        <div 
            style={{
                backgroundColor: theme.background,
                color: theme.color,
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                maxWidth: '600px',
                margin: 'auto',
                fontFamily: 'Arial, sans-serif'
            }}
        >
            <h1 style={{ color: theme.headingColor }}>Task Details</h1>
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Category:</strong> {task.category}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Deadline:</strong> {task.dueDate}</p>
        </div>
    );
};

export default TaskDetailsPage;
