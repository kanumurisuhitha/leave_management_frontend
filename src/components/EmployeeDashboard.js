import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [activeTab, setActiveTab] = useState("apply");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const employeeId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  // Fetch employee profile (name, etc.)
  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/employee/profile"); // ✅ you need this endpoint
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const res = await api.get(`/leave/balance/${employeeId}`);
      setLeaveBalance(res.data.leaveBalance);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to fetch leave balance");
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leave/mine"); // ✅ only employee's leaves
      setLeaves(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/employee/login");
      return;
    }
    fetchProfile();
    fetchLeaveBalance();
    fetchLeaves();
  }, [navigate, token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leave/apply", { ...form }); // employeeId not needed
      alert("Leave applied successfully");
      setForm({ startDate: "", endDate: "", reason: "" });
      fetchLeaveBalance();
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to apply leave");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/employee/login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      {/* Topbar */}
      <div className="dashboard-topbar">
        <div className="topbar-left">
          <button
            className={activeTab === "apply" ? "active" : ""}
            onClick={() => setActiveTab("apply")}
          >
            Apply Leave
          </button>
          <button
            className={activeTab === "history" ? "active" : ""}
            onClick={() => setActiveTab("history")}
          >
            Leave History
          </button>
        </div>
        <div className="topbar-right">
          {profile && <span className="profile-name">👤 {profile.name}</span>}
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <h2>Employee Dashboard</h2>
        <p style={{ marginBottom: "20px" }}>
          Leave Balance: <strong>{leaveBalance} days</strong>
        </p>

        {activeTab === "apply" && (
          <div>
            <h3>Apply for Leave</h3>
            <form className="dashboard-form" onSubmit={handleApply}>
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
              <label>Reason</label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
              />
              <button type="submit">Apply</button>
            </form>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h3>Your Leave Requests</h3>
            {leaves.length === 0 ? (
              <p>No leave requests yet.</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                      <td>{leave.reason || "-"}</td>
                      <td>{leave.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
