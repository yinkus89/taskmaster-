import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the api instance

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        deadline: '',
        priority: 1,
        category: '',
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);  // Task creation loading state
    const [isDeleting, setIsDeleting] = useState(false);  // Task deletion loading state

    // Fetch categories from the backend
    useEffect(() => {
        api.get('/categories') // Use the api instance
            .then(response => setCategories(response.data))
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    // Fetch tasks for the logged-in user
    useEffect(() => {
        api.get('/tasks') // Use the api instance
            .then(response => setTasks(response.data))
            .catch(err => console.error('Error fetching tasks:', err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true); // Set loading state to true

        // Category validation
        if (!categories.find(cat => cat.name === newTask.category)) {
            setError('Please select a valid category.');
            setIsLoading(false); // Reset loading state
            return;
        }

        // Field validation
        if (!newTask.title || !newTask.description || !newTask.deadline || !newTask.category) {
            setError('Please fill in all required fields.');
            setIsLoading(false); // Reset loading state
            return;
        }

        try {
            const response = await api.post('/tasks', newTask); // Use the api instance
            setTasks(prevTasks => [...prevTasks, response.data]);
            setNewTask({ title: '', description: '', deadline: '', priority: 1, category: '' });
        } catch (err) {
            setError('Failed to create task. Please try again.');
            console.error('Error creating task:', err);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {  // Confirmation dialog
            setIsDeleting(true); // Set deleting state to true
            try {
                await api.delete(`/tasks/${taskId}`); // Use the api instance
                setTasks(tasks.filter(task => task._id !== taskId));
            } catch (err) {
                console.error('Error deleting task:', err);
            } finally {
                setIsDeleting(false); // Reset deleting state
            }
        }
    };

    return (
        <div>
            <h2>Task Management</h2>

            <h3>Create Task</h3>
            <form onSubmit={handleCreateTask}>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        placeholder="Task Title"
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={newTask.description}
                        onChange={handleInputChange}
                        placeholder="Task Description"
                        required
                    />
                </label>
                <label>
                    Deadline:
                    <input
                        type="date"
                        name="deadline"
                        value={newTask.deadline}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Category:
                    <input
                        list="categoryOptions"
                        name="category"
                        value={newTask.category}
                        onChange={handleInputChange}
                        placeholder="Select or type a category"
                        required
                    />
                    <datalist id="categoryOptions">
                        {categories.map(category => (
                            <option key={category._id} value={category.name}>{category.name}</option>
                        ))}
                    </datalist>
                </label>
                <label>
                    Priority (1-4):
                    <input
                        type="number"
                        name="priority"
                        value={newTask.priority}
                        onChange={handleInputChange}
                        placeholder="Priority (1-4)"
                        min="1"
                        max="4"
                        required
                    />
                </label>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Task...' : 'Create Task'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Your Tasks</h3>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <p>Category: {task.category}</p>
                        <p>Priority: {task.priority}</p>
                        <p>Deadline: {new Date(task.dueDate).toLocaleDateString()}</p>
                        <button 
                            onClick={() => handleDeleteTask(task._id)} 
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskPage;
