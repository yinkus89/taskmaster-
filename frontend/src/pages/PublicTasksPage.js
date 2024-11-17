import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const PublicTasksPage = () => {
  const [publicTasks, setPublicTasks] = useState([]); // State to store the tasks
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(true); // Loading state

  const fetchPublicTasks = useCallback(async () => {
    setLoading(true); // Set loading to true when fetching starts
    setError(null); // Clear previous errors

    try {
      // Public tasks should be fetched without the Authorization header
      const tasksResponse = await axios.get("http://localhost:5000/api/tasks/public");

      if (tasksResponse.data.success) {
        setPublicTasks(tasksResponse.data.tasks); // Set the tasks data in state
      } else {
        setError("Failed to load public tasks.");
      }
    } catch (error) {
      console.error("Error fetching public tasks:", error); // Added console error for debugging
      setError("Failed to load public tasks. Please try again.");
    } finally {
      setLoading(false); // Set loading to false once the request is completed
    }
  }, []);

  useEffect(() => {
    fetchPublicTasks(); // Fetch public tasks when the component mounts
  }, [fetchPublicTasks]);

  if (loading) {
    return <p>Loading public tasks...</p>;
  }

  return (
    <div>
      <h2>Public Tasks</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {publicTasks.length === 0 ? (
        <p>No public tasks available.</p>
      ) : (
        <ul>
          {publicTasks.map((task) => (
            <li key={task._id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PublicTasksPage;
