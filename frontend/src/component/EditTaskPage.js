import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

const EditTaskPage = () => {
  const { taskId } = useParams();
  const history = useHistory();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch task.");
        setLoading(false);
      }
    };

    if (token) {
      fetchTask();
    }
  }, [taskId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/tasks/${taskId}`, task, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Task updated successfully!");
      history.push("/profile"); // Redirect back to profile
    } catch (err) {
      alert("Failed to update task.");
    }
  };

  if (loading) return <div>Loading task...</div>;

  return (
    <div>
      <h2>Edit Task</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Task Title"
        />
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Task Description"
        />
        <input
          type="date"
          name="deadline"
          value={task.deadline}
          onChange={handleChange}
        />
        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default EditTaskPage;
