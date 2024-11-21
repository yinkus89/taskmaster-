import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Task Manager</h1>
      <p>
        <Link to="/tasks">View Your Tasks</Link> {/* Link to Task List Page */}
      </p>
      <p>
        <Link to="/tasks/new">Create New Task</Link> {/* Link to Create Task Page */}
      </p>
    </div>
  );
}

export default HomePage;

