import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParentDashboard from "./pages/Dashboard/ParentDashboard";
import KidsDashboard from "./pages/Dashboard/KidsDashboard";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChildLogin from "./components/ChildLogin";
import YuyuNumberPop from "./components/Games/YuyuNumberPop";
import YuyuShapeSorter from "./components/Games/YuyuShapeSorter";
import YuyuTicTacToe from "./components/Games/YuyuTicTacToe";
import YuyuCandyCrush from "./components/Games/YuyuCandyCrush.jsx";
import YuyuAIAssistant from "./components/YuyuAIAssistant";
import YuyuDrawing from "./pages/YuyuDrawing.jsx";
import YuyuCloudAdventure from "./components/Games/YuyuCloudAdventure.jsx";
import Books from "./components/Books/Books.jsx"

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/child-login" element={<ChildLogin />} />
        <Route path="/books" element={<Books childName="mery" />} />

        {/* Dashboard Pages */}
        <Route path="/dashboard" element={<ParentDashboard />} />
        <Route path="/kids-dashboard" element={<KidsDashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Games */}
        <Route path="/YuyuNumberPop" element={<YuyuNumberPop />} />
        <Route path="/YuyuShapeSorter" element={<YuyuShapeSorter />} />
        <Route path="/YuyuTicTacToe" element={<YuyuTicTacToe />} />
        <Route path="/YuyuCandyCrush" element={<YuyuCandyCrush />} />
        <Route path="/YuyuCloudAdventure" element={<YuyuCloudAdventure/>} />

        {/* Creative Tools */}
        <Route path="/YuyuAIAssistant" element={<YuyuAIAssistant />} />
        <Route path="/YuyuDrawing" element={<YuyuDrawing />} />
      </Routes>
    </Router>
  );
}

export default App;