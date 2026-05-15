import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLoginPage({ setAdminToken }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      setError('Enter username');
      return;
    }
    if (!formData.password.trim()) {
      setError('Enter password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/admin/login', formData);

      localStorage.setItem('adminToken', response.data.token);
      setAdminToken(response.data.token);

      // Redirect to admin dashboard
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        {error && <div className="message error">{error}</div>}

        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            disabled={loading}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

    </div>
  );
}

export default AdminLoginPage;
