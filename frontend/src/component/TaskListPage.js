import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TaskListPage() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch tasks from the API
        axios.get('http://localhost:5000/api/tasks', { withCredentials: true })
            .then(response => setTasks(response.data))
            .catch(error => console.error("Error fetching tasks:", error));

        // Fetch categories (you might have a categories API or predefined categories)
        axios.get('http://localhost:5000/api/categories', { withCredentials: true })
            .then(response => setCategories(response.data))
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    // Get category name from the category ID
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.name : 'Unknown Category';
    };

    return (
        <div>
            <h1>Your Tasks</h1>
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
        </div>
    );
}

export default TaskListPage;
