import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Make sure to import Link for routing

const PublicTasksPage = () => {
  const [publicTasks, setPublicTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch public tasks
  const fetchPublicTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Get token from localStorage (or wherever it's stored)
    const token = localStorage.getItem("token");

    try {
      const tasksResponse = await axios.get("http://localhost:5000/api/tasks/public", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",  // Attach token if available
        }
      });

      if (tasksResponse.data.success) {
        setPublicTasks(tasksResponse.data.tasks);
      } else {
        setError("Failed to load public tasks.");
      }
    } catch (error) {
      console.error("Error fetching public tasks:", error.response || error);
      setError(error.response?.data?.message || "Failed to load public tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicTasks();
  }, [fetchPublicTasks]);

  // Show loading spinner while data is being fetched
  if (loading) {
    return <div className="spinner">Loading public tasks...</div>;
  }

  return (
    <div>
      <h2>Public Tasks</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {publicTasks.length === 0 ? (
        <p>No public tasks available. <a href="/create-task">Create a new task.</a></p>
      ) : (
        <ul>
          {publicTasks.map((task) => (
            <li key={task._id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              <Link to={`/tasks/${task._id}`}>View Task</Link> {/* Example of passing the task ID */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PublicTasksPage;
