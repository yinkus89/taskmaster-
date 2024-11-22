import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({ tasks: false, categories: false });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [tasksPerPage] = useState(10); // You can adjust this number

  const fetchCategories = useCallback(async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      if (Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
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
    if (!token) {
      setError("You need to be logged in to see your tasks.");
      return;
    }

    const url = selectedCategory
      ? `http://localhost:5000/api/tasks?category=${selectedCategory}&page=${page}&limit=${tasksPerPage}`
      : `http://localhost:5000/api/tasks?page=${page}&limit=${tasksPerPage}`;
      
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(url, { headers });
      setTasks(response.data.tasks);
      setTotalTasks(response.data.totalTasks || 0); // Assuming the API returns totalTasks
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          fetchTasks(); // Retry fetching tasks after refreshing token
        } else {
          setError("Session expired. Please log in again.");
          window.location.href = "/login"; // Redirect to login if refresh fails
        }
      } else {
        setError("Failed to load tasks. Please try again.");
      }
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  }, [selectedCategory, page, tasksPerPage]);

  const handleTokenRefresh = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/refresh", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (response.data.token) {
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        return true;
      } else {
        console.error("No token received from server");
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset page to 1 when the category changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, [fetchCategories, fetchTasks, selectedCategory, page]);

  if (loading.tasks || loading.categories) {
    return <p>Loading tasks and categories...</p>;
  }

  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  return (
    <div>
      <h2>Task List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label htmlFor="category">Filter by Category: </label>
      <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
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
        <>
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
                  <td>{task.category?.name || 'No category'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span> Page {page} of {totalPages} </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskListPage;
