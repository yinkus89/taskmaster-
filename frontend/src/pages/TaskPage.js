import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    // Fetch categories from the backend
    useEffect(() => {
        axios.get('http://localhost:5000/api/categories', { withCredentials: true })
            .then(response => setCategories(response.data))
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    // Fetch tasks for the logged-in user
    useEffect(() => {
        axios.get('http://localhost:5000/api/tasks', { withCredentials: true })
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

        if (!newTask.title || !newTask.description || !newTask.deadline || !newTask.category) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/tasks', newTask, { withCredentials: true });
            setTasks(prevTasks => [...prevTasks, response.data]);
            setNewTask({ title: '', description: '', deadline: '', priority: 1, category: '' });
        } catch (err) {
            setError('Failed to create task. Please try again.');
            console.error('Error creating task:', err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, { withCredentials: true });
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (err) {
            console.error('Error deleting task:', err);
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
                <button type="submit">Create Task</button>
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
                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskPage;
