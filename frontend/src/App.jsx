import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParentDashboard from "./pages/Dashboard/ParentDashboard";
import KidsDashboard from "./pages/Dashboard/KidsDashboard";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Pages */}
                <Route path="/dashboard" element={<ParentDashboard />} />
                <Route path="/kids-dashboard" element={<KidsDashboard />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />


      </Routes>
    </Router>
  );
}

export default App;