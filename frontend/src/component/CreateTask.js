import React, { useState } from 'react';
import axios from 'axios';

const CreateTask = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    deadline: '',
    status: 'pending',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (!task.title || !task.description || !task.category || !task.priority || !task.deadline) {
      setError('All fields must be filled out.');
      return;
    }

    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('You must be logged in to create a task.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/tasks', task, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the token in the request headers
        },
      });

      if (response.status === 201) {
        setSuccess('Task created successfully!');
        // Clear the form after successful submission
        setTask({
          title: '',
          description: '',
          category: '',
          priority: '',
          deadline: '',
          status: 'pending',
        });
      }
    } catch (err) {
      console.error('Error creating task:', err);
      if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError('Failed to create task. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Task</h2>

      {/* Title Input */}
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={task.title}
        onChange={handleChange}
        required
      />

      {/* Description Input */}
      <textarea
        name="description"
        placeholder="Task Description"
        value={task.description}
        onChange={handleChange}
        required
      />

      {/* Category Input */}
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={task.category}
        onChange={handleChange}
        required
      />

      {/* Priority Input */}
      <input
        type="number"
        name="priority"
        placeholder="Priority (1-4)"
        value={task.priority}
        onChange={handleChange}
        required
        min="1"
        max="4"
      />

      {/* Due Date Input */}
      <input
        type="date"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChange}
        required
      />

      {/* Status Select */}
      <select
        name="status"
        value={task.status}
        onChange={handleChange}
        required
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Error and Success Messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Loading State */}
      {loading ? (
        <button type="button" disabled>
          Creating Task...
        </button>
      ) : (
        <button type="submit">Create Task</button>
      )}
    </form>
  );
};

export default CreateTask;
