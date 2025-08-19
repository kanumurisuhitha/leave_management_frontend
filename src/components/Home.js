import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Leave Management System</h1>
        <p className="subtitle">Manage employee leaves with ease 🚀</p>
      </header>

      <main className="home-main">
        <div className="card">
          <h2>HR Portal</h2>
          <p>Login as HR to manage employees and approve/reject leaves.</p>
          <Link to="/hr/login" className="btn">HR Login</Link>
          <Link to="/hr/signup" className="btn secondary">HR Signup</Link>
        </div>

        <div className="card">
          <h2>Employee Portal</h2>
          <p>Login as Employee to apply for leave and track your balance.</p>
          <Link to="/employee/login" className="btn">Employee Login</Link>
        </div>
      </main>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} Leave Management System. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
