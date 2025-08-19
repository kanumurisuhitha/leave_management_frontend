import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './EmployeeLogin.css';

function EmployeeLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/employee/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/employee/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (<div className="login-container">
  <form className="login-box" onSubmit={handleSubmit}>
    <h2 className="login-title">Employee Login</h2>
    
    <div className="input-group">
      <label>Email</label>
      <input 
        name="email" 
        type="email" 
        placeholder="Enter your email" 
        onChange={handleChange} 
        required 
      />
    </div>

    <div className="input-group">
      <label>Password</label>
      <input 
        name="password" 
        type="password" 
        placeholder="Enter your password" 
        onChange={handleChange} 
        required 
      />
    </div>

    <button className="login-btn" type="submit">Login</button>

    {/* 🔹 Go Back Button */}
    <button
      type="button"
      className="go-back-btn"
      onClick={() => navigate('/')}
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
  </form>
</div>
)
}

export default EmployeeLogin;
