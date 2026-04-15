import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParentDashboard from "./pages/Dashboard/ParentDashboard";
import KidsDashboard from "./pages/Dashboard/KidsDashboard";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Profile from "./pages/Profile";
import ChildLogin from "./components/ChildLogin";
import YuyuNumberPop from "./components/Games/YuyuNumberPop";
import YuyuShapeSorter from "./components/";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />


        {/*Pages */}
           <Route path="/YuyuNumberPop" element={<YuyuNumberPop/>} />
              <Route path="/YuyuShapeSorter" element={<YuyuShapeSorter/>} />
                <Route path="/dashboard" element={<ParentDashboard />} />
                <Route path="/kids-dashboard" element={<KidsDashboard />} />
                  <Route path="/profile" element={<Profile />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword/>} />
                        <Route path="/child-login" element={<ChildLogin />} />



      </Routes>
    </Router>
  );
}

export default App;