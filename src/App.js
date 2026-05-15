import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize system setup
    axios.post('/api/setup').catch(error => console.error('Setup error:', error));
  }, []);

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <>
      <nav>
        <h1>✈️ FlyTicket</h1>
        <div>
          <Link to="/">Home</Link>
          {adminToken ? (
            <>
              <Link to="/admin">Admin Panel</Link>
              <button onClick={handleLogout} style={{ marginLeft: '1rem', backgroundColor: 'transparent', padding: '0.5rem 1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin-login">Admin Login</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:flightId" element={<BookingPage />} />
        <Route path="/confirmation/:ticketId" element={<ConfirmationPage />} />
        <Route path="/admin-login" element={<AdminLoginPage setAdminToken={setAdminToken} />} />
        <Route path="/admin" element={adminToken ? <AdminDashboard token={adminToken} /> : <AdminLoginPage setAdminToken={setAdminToken} />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
