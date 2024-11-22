import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      setUser(user);

      setUpdatedData({
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
      });

      const fetchTasks = async (page = 1, limit = 10) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/tasks?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
      
          if (response.data.success) {
            setTasks(response.data.tasks);
          } else {
            setTasks([]);
            setError('No tasks found for this user.');
          }
        } catch (err) {
          setError('Error fetching tasks. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      

      fetchTasks();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        'http://localhost:5000/api/user/profile',
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.profile);
      localStorage.setItem('user', JSON.stringify(response.data.profile));
      setIsEditing(false);
    } catch (error) {
      setError('Error updating profile.');
    }
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!updatedData.name || !updatedData.email) {
      setError('Name and email are required.');
      return;
    }
    updateProfile(updatedData);
  };

  const priorityLabel = (priority) => {
    const labels = ['Low', 'Medium', 'High', 'Urgent'];
    return labels[priority - 1] || 'Unknown';
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <img
        src={user.avatar || 'default-avatar.jpg'}
        alt="Avatar"
        style={{ width: '50px', borderRadius: '50%' }}
      />

      <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>

      <h3>Your Tasks</h3>
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.categoryId?.name || 'Uncategorized'}</td>
                <td>{priorityLabel(task.priority)}</td>
                <td>{task.status || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => setIsEditing(!isEditing)} style={editButtonStyle}>
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
          <button type="submit" style={saveButtonStyle}>
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}

const tableStyle = { width: '80%', margin: '20px auto', borderCollapse: 'collapse' };
const logoutButtonStyle = { backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', marginTop: '20px' };
const editButtonStyle = { backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', marginTop: '20px' };
const saveButtonStyle = { backgroundColor: 'green', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', marginTop: '20px' };

export default ProfilePage;
