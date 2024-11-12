import React, { useState } from 'react';
import axios from 'axios';

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      category,
      priority,
      dueDate,
      status,
    };

    try {
      const response = await axios.post('/api/tasks', taskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201) {
        // Task created successfully
        setSuccess('Task created successfully!');
        setError(''); // Reset error message if successful
        // Clear form fields
        setTitle('');
        setDescription('');
        setCategory('');
        setPriority('');
        setDueDate('');
        setStatus('pending');
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
      setSuccess(''); // Reset success message on error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Task</h2>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button type="submit">Create Task</button>
    </form>
  );
};

export default CreateTask;
