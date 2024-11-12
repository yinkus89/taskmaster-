import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TaskListPage() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track any errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch tasks
                const taskResponse = await axios.get('http://localhost:5000/api/tasks', { withCredentials: true });
                setTasks(taskResponse.data);

                // Fetch categories
                const categoryResponse = await axios.get('http://localhost:5000/api/categories', { withCredentials: true });
                setCategories(categoryResponse.data);

                setLoading(false); // Data has been fetched, set loading to false
            } catch (err) {
                setError("Error fetching data. Please try again.");
                setLoading(false); // If an error occurs, set loading to false
            }
        };

        fetchData();
    }, []);

    // Get category name from category ID
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.name : 'Unknown Category';
    };

    if (loading) {
        return <p>Loading...</p>; // Show loading message while fetching data
    }

    if (error) {
        return <p>{error}</p>; // Show error message if fetching fails
    }

    return (
        <div>
            <h1>Your Tasks</h1>
            {tasks.length === 0 ? (
                <p>No tasks available.</p>
            ) : (
                <ul>
                    {tasks.map(task => (
                        <li key={task._id}>
                            <strong>{task.title}</strong> - {task.priority}
                            <p>{task.description}</p>
                            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                            <p>Category: {getCategoryName(task.category)}</p>
                            <p>Status: {task.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskListPage;
