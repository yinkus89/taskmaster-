import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Define filter based on category
        const categoryParam = categoryFilter !== "All Categories" ? `?category=${categoryFilter}` : "";

        const response = await axios.get(`/api/tasks${categoryParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.tasks) {
          setTasks(response.data.tasks);
        } else {
          setError("No tasks available.");
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [categoryFilter]);

  return (
    <div>
      <h2>Task List</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>Filter by Category:</label>
        <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
          <option>All Categories</option>
          <option>General</option>
          <option>Work</option>
          <option>Personal</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
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

export default TaskPage;
