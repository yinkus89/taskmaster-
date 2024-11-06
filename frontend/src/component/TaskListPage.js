import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TaskListPage() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/tasks', { withCredentials: true })
            .then(response => setTasks(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Your Tasks</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>{task.title} - {task.priority}</li>
                ))}
            </ul>
        </div>
    );
}

export default TaskListPage;
