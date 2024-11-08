import React, { useState } from 'react';
import axios from 'axios';

const TaskFormPage = () => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        deadline: '',
        status: 'pending',
        category: '', // Store category ID
        priority: '', // Store priority level
    });

    const [error, setError] = useState(null);

    // Hardcoded category list (replace with dynamic data if needed)
    const categoriesList = [
        { _id: "work", name: "Work", description: "Work-related tasks", priorityLevel: 1 },
        { _id: "personal", name: "Personal", description: "Personal tasks", priorityLevel: 2 },
        { _id: "health", name: "Health", description: "Health and fitness tasks", priorityLevel: 3 },
        { _id: "finance", name: "Finance", description: "Budgeting, bills, and financial management tasks", priorityLevel: 3 },
        { _id: "education", name: "Education", description: "Learning goals, courses, or skill-building activities", priorityLevel: 2 },
        { _id: "family", name: "Family", description: "Family obligations and household tasks", priorityLevel: 1 },
        { _id: "shopping", name: "Shopping", description: "Shopping lists or items to buy", priorityLevel: 3 },
        { _id: "errands", name: "Errands", description: "Quick errands or small tasks outside of home or work", priorityLevel: 2 },
        { _id: "travel", name: "Travel", description: "Planning for trips, vacations, and travel logistics", priorityLevel: 3 },
        { _id: "miscellaneous", name: "Miscellaneous", description: "General tasks that don’t fall into any specific category", priorityLevel: 4 }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Ensure the priority is an integer (it should be between 1 and 4)
        const priorityNumber = parseInt(task.priority);
        if (isNaN(priorityNumber) || priorityNumber < 1 || priorityNumber > 4) {
            return setError('Priority must be a number between 1 and 4.');
        }

        const taskData = {
            title: task.title,
            description: task.description,
            category: task.category, // Sending the category ID
            priority: priorityNumber, // Sending numeric priority
            deadline: new Date(task.deadline).toISOString(), // Ensure deadline is in ISO format
        };

        try {
            const response = await axios.post('http://localhost:5000/api/tasks', taskData, {
                withCredentials: true, // Send cookies (like the token) with the request
            });
            console.log('Task created:', response.data);

            // Reset the form after successful submission
            setTask({
                title: '',
                description: '',
                deadline: '',
                status: 'pending',
                category: '',
                priority: '',
            });
        } catch (err) {
            console.error('Error creating task:', err);
            setError('Failed to create task. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Task</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    placeholder="Task Title"
                    required
                />
                <textarea
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    placeholder="Task Description"
                    required
                />
                <input
                    type="date"
                    name="deadline"
                    value={task.deadline}
                    onChange={handleChange}
                    required
                />
                <select name="status" value={task.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                <select
                    name="category"
                    value={task.category}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select Category</option>
                    {categoriesList.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name} - {category.description} (Priority {category.priorityLevel})
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    placeholder="Priority (1-4)"
                    required
                    min="1"
                    max="4"
                />
                <button type="submit">Create Task</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default TaskFormPage;
