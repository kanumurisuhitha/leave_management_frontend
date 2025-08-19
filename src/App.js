import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import HRLogin from './components/HRLogin';
import HRSignup from './components/HRSignup';
import HRDashboard from './components/HRDashboard';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hr/signup" element={<HRSignup />} />
      <Route path="/hr/login" element={<HRLogin />} />
      <Route path="/hr/dashboard" element={<HRDashboard />} />
      <Route path="/employee/login" element={<EmployeeLogin />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
    </Routes>
  );
}

export default App;
