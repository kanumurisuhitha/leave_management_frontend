import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import './HRLogin.css';

function HRLogin() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/auth/hr/login', form);
    localStorage.setItem('token', res.data.token);

    // 🔥 Save logged-in HR details immediately
    localStorage.setItem('user', JSON.stringify(res.data.hr));

    alert('Login successful');
    navigate('/hr/dashboard');
  } catch (err) {
    alert(err.response?.data?.error || 'Login failed');
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">HR Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="signup-text">
          Don’t have an account? <Link to="/hr/signup">Sign up here</Link>
        </p>

        {/* ✅ Go Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="go-back-btn"
          style={{
            marginTop: '10px',
            backgroundColor: '#555',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default HRLogin;
