import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './HRSignup.css';

function HRSignup() {
  const [form, setForm] = useState({
    name: '',
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
    const res = await api.post('/auth/hr/register', form);

    // Save token immediately
    localStorage.setItem('token', res.data.token);

    alert('Signup successful');
    navigate('/hr/login');
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || 'Signup failed');
  }
};


  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>HR Signup</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

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

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default HRSignup;
