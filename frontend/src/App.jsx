import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParentDashboard from "./pages/Dashboard/ParentDashboard";
import KidsDashboard from "./pages/Dashboard/KidsDashboard";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./components/Profile";
import ChildLogin from "./components/ChildLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import YuyuNumberPop from "./components/Games/YuyuNumberPop";
import YuyuShapeSorter from "./components/Games/YuyuShapeSorter";
import YuyuCandyCrush from "./components/Games/YuyuCandyCrush";
import YuyuTicTacToe from "./components/Games/YuyuTicTacToe";
import YuyuMemoryMatch from "./components/Games/YuyuMemoryMatch";
import YuyuDrawing from "./pages/YuyuDrawing";
import ChildProfile from "./components/Profile";

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
        <Route path="/dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
        <Route path="/child-login" element={<ProtectedRoute><ChildLogin /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/kids-dashboard" element={<ProtectedRoute><KidsDashboard /></ProtectedRoute>} />
        <Route path="/child-profile" element={<ProtectedRoute><ChildProfile /></ProtectedRoute>} />

        {/* GAME ROUTES */}
        <Route path="/YuyuNumberPop" element={<ProtectedRoute><YuyuNumberPop /></ProtectedRoute>} />
        <Route path="/YuyuShapeSorter" element={<ProtectedRoute><YuyuShapeSorter /></ProtectedRoute>} />
        <Route path="/YuyuMemoryMatch" element={<ProtectedRoute><YuyuMemoryMatch /></ProtectedRoute>} />
        <Route path="/YuyuTicTacToe" element={<ProtectedRoute><YuyuTicTacToe /></ProtectedRoute>} />
        <Route path="/YuyuCandyCrush" element={<ProtectedRoute><YuyuCandyCrush /></ProtectedRoute>} />
        <Route path="/YuyuDrawing" element={<ProtectedRoute><YuyuDrawing /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;