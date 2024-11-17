import React, { useState, useEffect } from "react";
import axios from "axios";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="spinner">
    <span>Loading...</span>
  </div>
);

// Category Select Component
const CategorySelect = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <select
      name="category"
      value={selectedCategory}
      onChange={onCategoryChange}
      required
    >
      <option value="" disabled>
        Select Category
      </option>
      {categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

const TaskFormPage = () => {
  const [token, setToken] = useState("");
  const [categoriesList, setCategoriesList] = useState([]); // Ensure default is an array
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const storageToken = localStorage.getItem("token");
    setToken(storageToken);

    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories", {
          headers: {
            Authorization: `Bearer ${storageToken}`,
          },
        });

        if (Array.isArray(response.data.categories)) {
          setCategoriesList(response.data.categories); // Set categories list
        } else {
          console.error("Unexpected categories response format", response.data);
          setCategoriesList([]); // Default to an empty array if response is not an array
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategoriesList([]); // Handle errors by falling back to an empty array
      } finally {
        setLoadingCategories(false);
      }
    };

    if (storageToken) {
      fetchCategories();
    } else {
      setCategoriesList([]); // Default to an empty array if no token is found
      setLoadingCategories(false);
    }
  }, []);

  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "pending",
    category: "", // Store category ID
    priority: "", // Store priority level
    visibility: "private", // Set default visibility to private
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "radio") {
      setTask((prevTask) => ({
        ...prevTask,
        [name]: checked ? value : prevTask[name],
      }));
    } else {
      setTask((prevTask) => ({
        ...prevTask,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous error message
    setSuccess(null); // Reset any previous success message

    // Validate required fields
    if (!task.title || !task.description || !task.deadline || !task.category || !task.priority) {
      return setError("All fields must be filled out.");
    }

    const taskData = {
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      categoryId: task.category, // Make sure this is the correct field
      priority: task.priority,
      visibility: task.visibility,
    };

    try {
      if (!token) {
        return setError("Authorization token is missing. Please login.");
      }

      setLoading(true);

      const response = await axios.post("http://localhost:5000/api/tasks", taskData, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is passed in headers
        },
      });

      if (response.status === 201) {
        setSuccess("Task created successfully!");
        setTask({
          title: "",
          description: "",
          deadline: "",
          category: "",
          priority: "",
        }); // Reset form after successful submission
      }
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Task</h2>

      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Task Title"
          required
        />
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Task Description"
          required
        />
        <input
          type="date"
          name="deadline"
          value={task.deadline}
          onChange={handleChange}
          required
        />
        <select name="status" value={task.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {loadingCategories ? (
          <LoadingSpinner />
        ) : (
          <CategorySelect
            categories={categoriesList}
            selectedCategory={task.category}
            onCategoryChange={handleChange}
          />
        )}

        <input
          type="number"
          name="priority"
          value={task.priority}
          onChange={handleChange}
          placeholder="Priority (1-4)"
          required
          min="1"
          max="4"
        />

        <div>
          <label>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={task.visibility === "public"}
              onChange={handleChange}
            />
            Public (Anyone can make an offer)
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={task.visibility === "private"}
              onChange={handleChange}
            />
            Private (Only you can view this task)
          </label>
        </div>

        <button type="submit" disabled={loading || loadingCategories}>
          {loading ? <LoadingSpinner /> : "Create Task"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TaskFormPage;
