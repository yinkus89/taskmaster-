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
    >
      <option value="">Select Category</option>
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
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "pending",
    category: "", // This should store category _id
    priority: "",
    visibility: "private",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories when the component mounts
  useEffect(() => {
    const storageToken = localStorage.getItem("token");
    setToken(storageToken);

    if (!storageToken) {
      setCategoriesList([]);
      setLoadingCategories(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/categories",
          {
            headers: {
              Authorization: `Bearer ${storageToken}`,
            },
          }
        );

        if (Array.isArray(response.data.categories)) {
          setCategoriesList(response.data.categories);
        } else {
          console.error("Unexpected categories response format", response.data);
          setCategoriesList([]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategoriesList([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
    setError(null);
    setSuccess(null);

    // Validate required fields
    if (
      !task.title ||
      !task.description ||
      !task.deadline ||
      !task.category ||
      !task.priority
    ) {
      return setError("All fields must be filled out.");
    }

    // Validate priority range
    if (task.priority < 1 || task.priority > 4) {
      return setError("Priority must be between 1 and 4.");
    }

    const taskData = {
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      category: task.category, // Make sure this maps correctly in the backend
      priority: task.priority,
      visibility: task.visibility,
    };

    try {
      setLoading(true); // Disable button when loading
      const response = await axios.post(
        "http://localhost:5001/api/tasks/create",
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Task created successfully!");
        setTask({
          title: "",
          description: "",
          deadline: "",
          category: "",
          priority: "",
          visibility: "private",
          status: "pending",
        });
      }
    } catch (error) {
      console.error(
        "Error creating task:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.message ||
          "Failed to create task. Please try again."
      );
    } finally {
      setLoading(false); // Re-enable the button after loading is done
    }
  };

  return (
    <div>
      <h2>Create Task</h2>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

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
    </div>
  );
};

export default TaskFormPage;
