import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParentDashboard from "./pages/Dashboard/ParentDashboard";
import KidsDashboard from "./pages/Dashboard/KidsDashboard";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/Profile";
import ChildLogin from "./components/ChildLogin";
import YuyuNumberPop from "./components/Games/YuyuNumberPop";
import YuyuShapeSorter from "./components/Games/YuyuShapeSorter";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES - Anyone can access */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* PROTECTED ROUTES - Require authentication */}
        <Route
          path="/child-login"
          element={
            <ProtectedRoute>
              <ChildLogin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/YuyuNumberPop"
          element={
            <ProtectedRoute>
              <YuyuNumberPop />
            </ProtectedRoute>
          }
        />

        <Route
          path="/YuyuShapeSorter"
          element={
            <ProtectedRoute>
              <YuyuShapeSorter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kids-dashboard"
          element={
            <ProtectedRoute>
              <KidsDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
