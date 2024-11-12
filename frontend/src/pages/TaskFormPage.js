import React, { useState } from 'react';
import axios from 'axios';

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="spinner">
        <span>Loading...</span>
    </div>
);

// Category Select Component
const CategorySelect = ({ categories, selectedCategory, onCategoryChange }) => (
    <select name="category" value={selectedCategory} onChange={onCategoryChange} required>
        <option value="" disabled>Select Category</option>
        {categories.map((category) => (
            <option key={category._id} value={category._id} title={category.description}>
                {category.name}
            </option>
        ))}
    </select>
);

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
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

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
        setSuccess(null);

        // Validate required fields
        if (!task.title || !task.description || !task.deadline || !task.category || !task.priority) {
            return setError('All fields must be filled out.');
        }

        // Ensure priority is an integer between 1 and 4
        const priorityNumber = parseInt(task.priority);
        if (isNaN(priorityNumber) || priorityNumber < 1 || priorityNumber > 4) {
            return setError('Priority must be a number between 1 and 4.');
        }

        const taskData = {
            title: task.title,
            description: task.description,
            category: task.category,
            priority: priorityNumber,
            deadline: new Date(task.deadline).toISOString(),
        };

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/tasks', taskData, {
                withCredentials: true,
            });
            console.log('Task created:', response.data);
            setSuccess('Task created successfully!');

            // Reset form after successful submission
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create Task</h2>

            {/* Success message */}
            {success && <p style={{ color: 'green' }}>{success}</p>}

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
                    <option value="pending">Pending (Task is not started yet)</option>
                    <option value="in-progress">In Progress (Task is being worked on)</option>
                    <option value="completed">Completed (Task is finished)</option>
                </select>

                <CategorySelect 
                    categories={categoriesList} 
                    selectedCategory={task.category} 
                    onCategoryChange={handleChange} 
                />

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

                <button type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner /> : 'Create Task'}
                </button>
            </form>

            {/* Error message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default TaskFormPage;
