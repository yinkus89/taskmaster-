import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProfilePage() {
  const [user, setUser] = useState(null); // Store user data
  const [tasks, setTasks] = useState([]); // Store tasks data
  const [isEditing, setIsEditing] = useState(false); // State to toggle between edit mode
  const [updatedData, setUpdatedData] = useState({
    name: '',
    email: '',
    avatar: '',
  }); // Store updated user data
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      setUser(user); // Set user data to state

      // Set initial values for updatedData to pre-fill the form
      setUpdatedData({
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
      });

      // Fetch tasks associated with the user
      const fetchTasks = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/tasks', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          setTasks(response.data.tasks || []);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchTasks();
    } else {
      navigate('/login'); // Redirect to login if no user data or token
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Handle changes in profile update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update the profile in the backend
  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        'http://localhost:5000/api/user/profile', 
        updatedData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.profile); // Update the user state with the new data
      localStorage.setItem('user', JSON.stringify(response.data.profile)); // Update localStorage
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Handle the profile form submission
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateProfile(updatedData);
  };

  // If the user data is still loading
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Avatar: 
        <img 
          src={user.avatar || 'default-avatar.jpg'} 
          alt="Avatar" 
          style={{ width: '50px', borderRadius: '50%' }} 
        />
      </p>

      <button 
        onClick={handleLogout}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Logout
      </button>

      <h3>Your Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <table style={{ width: '80%', margin: '20px auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Description</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Priority</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{task.title}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{task.description}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{task.categoryId?.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{task.priority}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button 
        onClick={() => setIsEditing(!isEditing)}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
      </button>

      {isEditing && (
        <form onSubmit={handleUpdateSubmit} style={{ marginTop: '30px' }}>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={updatedData.name}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={updatedData.email}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Avatar URL:
              <input
                type="text"
                name="avatar"
                value={updatedData.avatar}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <button 
            type="submit"
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}

export default ProfilePage;
