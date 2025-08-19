// src/pages/HRDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './HRDashboard.css';

function HRDashboard() {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    joiningDate: ''
  });
  const [hrProfile, setHrProfile] = useState(null);

  const navigate = useNavigate();

  // ✅ On mount, check auth & localStorage profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      navigate('/hr/login');
      return;
    }

    if (storedUser) {
      setHrProfile(JSON.parse(storedUser)); // set immediately
    }

    fetchProfile(); // fetch fresh data from API
    fetchEmployees();
    fetchLeaves();
  }, [navigate]);

  // ✅ Fetch HR Profile from backend
  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/hr/profile');
      setHrProfile(res.data);
      localStorage.setItem('user', JSON.stringify(res.data)); // keep updated
    } catch (err) {
      console.error('Failed to fetch HR profile', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/hr/login');
    }
  };

  // ✅ Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employee/all');
      setEmployees(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fetch employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  // ✅ Fetch leaves
  const fetchLeaves = async () => {
    try {
      const res = await api.get('/leave/all');
      setLeaves(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fetch leaves');
    } finally {
      setLoadingLeaves(false);
    }
  };

  // ✅ Handle input
  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  // ✅ Add employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/employee/add', newEmployee);
      alert('Employee added successfully');
      setNewEmployee({
        name: '',
        email: '',
        password: '',
        department: '',
        joiningDate: ''
      });
      fetchEmployees();
      setActiveTab('employees');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add employee');
    }
  };

  // ✅ Approve/Reject leave
  const handleLeaveAction = async (leaveId, action) => {
    try {
      const url =
        action === 'approve'
          ? `/leave/approve/${leaveId}`
          : `/leave/reject/${leaveId}`;
      await api.post(url);
      alert(`Leave ${action}d successfully`);
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.error || `Failed to ${action} leave`);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setHrProfile(null);
    navigate('/hr/login');
  };

  return (
    <div className="dashboard-container">
      {/* ✅ Topbar */}
      <div className="dashboard-topbar">
        <div className="topbar-left">
          <button
            className={activeTab === 'employees' ? 'active' : ''}
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
          <button
            className={activeTab === 'leaves' ? 'active' : ''}
            onClick={() => setActiveTab('leaves')}
          >
            Leave Requests
          </button>
          <button
            className={activeTab === 'add' ? 'active' : ''}
            onClick={() => setActiveTab('add')}
          >
            Add Employee
          </button>
        </div>
        <div className="topbar-right">
          {hrProfile && (
            <span className="profile-name">👤 {hrProfile.name}</span>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ✅ Content */}
      <div className="dashboard-content">
        {activeTab === 'employees' && (
          <section>
            <h2>Employees</h2>
            {loadingEmployees ? (
              <p>Loading employees...</p>
            ) : employees.length === 0 ? (
              <p>No employees found.</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Joining Date</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.department}</td>
                      <td>{new Date(emp.joiningDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {activeTab === 'leaves' && (
          <section>
            <h2>Leave Requests</h2>
            {loadingLeaves ? (
              <p>Loading leave requests...</p>
            ) : leaves.length === 0 ? (
              <p>No leave requests found.</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>{leave.employee.name}</td>
                      <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td>{leave.reason || '-'}</td>
                      <td>{leave.status}</td>
                      <td>
                        {leave.status === 'Pending' ? (
                          <>
                            <button
                              className="action-btn approve"
                              onClick={() =>
                                handleLeaveAction(leave._id, 'approve')
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="action-btn reject"
                              onClick={() =>
                                handleLeaveAction(leave._id, 'reject')
                              }
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {activeTab === 'add' && (
          <section>
            <h2>Add Employee</h2>
            <form className="dashboard-form" onSubmit={handleAddEmployee}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                required
              />

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleInputChange}
                required
              />

              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={newEmployee.password}
                onChange={handleInputChange}
                required
              />

              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={newEmployee.department}
                onChange={handleInputChange}
                required
              />

              <label>Joining Date:</label>
              <input
                type="date"
                name="joiningDate"
                value={newEmployee.joiningDate}
                onChange={handleInputChange}
                required
              />

              <button type="submit">Add Employee</button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default HRDashboard;
