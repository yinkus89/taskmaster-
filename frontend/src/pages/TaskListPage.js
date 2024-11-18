import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]); // Tasks state
  const [categories, setCategories] = useState([]); // Categories state
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState({ tasks: false, categories: false }); // Loading state for tasks and categories
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category state

  const fetchCategories = useCallback(async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    setError(null);

    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      if (Array.isArray(response.data.categories)) {
        setCategories(response.data.categories); // Assuming response contains categories in 'categories'
      } else {
        setError("Failed to load categories. Invalid response format.");
      }
    } catch (error) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(prev => ({ ...prev, tasks: true }));
    setError(null);

    const token = localStorage.getItem("token");
    const url = selectedCategory
      ? `http://localhost:5000/api/tasks?category=${selectedCategory}`
      : "http://localhost:5000/api/tasks"; // Fetch all tasks

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(url, { headers });
      setTasks(response.data.tasks); // Assuming response contains tasks in 'tasks'
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          fetchTasks(); // Retry after refreshing token
        } else {
          setError("Session expired. Please log in again.");
        }
      } else {
        setError("Failed to load tasks. Please try again.");
      }
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  }, [selectedCategory]);

  const handleTokenRefresh = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/refresh", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Set the selected category
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component mounts
    fetchTasks(); // Fetch tasks when the component mounts
  }, [fetchCategories, fetchTasks]);

  if (loading.tasks || loading.categories) {
    return <p>Loading tasks and categories...</p>;
  }

  return (
    <div>
      <h2>Task List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label htmlFor="category">Filter by Category: </label>
      <select
        id="category"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="">All Categories</option>
        {categories.length === 0 ? (
          <option disabled>Loading categories...</option>
        ) : (
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </option>
          ))
        )}
      </select>

      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.category?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskListPage;
