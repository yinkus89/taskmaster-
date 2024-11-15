import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function TaskListPage() {
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log(userId);
    const token = localStorage.getItem("token");
    const fetchTasks = async () => {
      try {
        // Fetch tasks
        const taskResponse = await axios.get(
          "http://localhost:5000/api/tasks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId,
            },
            withCredentials: true,
          }
        );
        console.log(taskResponse.data.tasks);
        setTasks(taskResponse.data.tasks);
        console.log(tasks);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTasks();
  }, [userId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(
          "http://localhost:5000/api/categories",
          { withCredentials: true }
        );
        setCategories(categoryResponse.data);
      } catch {}
    };
    fetchCategories();
  }, [userId]);

  // Get category name from category ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div>
      <h1>Your Tasks</h1>
      <ul>
        {tasks &&
          tasks.map((task) => (
            <li key={task._id}>
              <strong>{task.title}</strong> - {task.priority}
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default TaskListPage;
