import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../contexts/ThemeContext';

const TaskDetailsPage = () => {
  const { taskId } = useParams(); // Get taskId from URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.data.success) {
          setError('Task not found.');
          return;
        }

        setTask(response.data.task);
      } catch (err) {
        console.error('Error fetching task details:', err);
        if (err.response && err.response.status === 404) {
          setError('Task not found.');
        } else {
          setError('Failed to load task details.');
        }
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  if (error) {
    return (
      <div style={{ backgroundColor: theme.background, color: theme.color }}>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => navigate('/tasks')}>Go to Task List</button>
      </div>
    );
  }

  if (!task) {
    return (
      <div style={{ backgroundColor: theme.background, color: theme.color }}>
        <h1>Loading task details...</h1>
      </div>
    );
  }

  // Format the deadline date
  const formattedDeadline = new Date(task.deadline).toLocaleDateString();

  return (
    <div style={{ backgroundColor: theme.background, color: theme.color }}>
      <h1>Task Details</h1>
      <p><strong>Title:</strong> {task.title}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Category:</strong> {task.category}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Deadline:</strong> {formattedDeadline}</p>
      
      {/* Back button */}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default TaskDetailsPage;
