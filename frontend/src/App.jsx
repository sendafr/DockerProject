import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar    from './Components/Navbar';
import AuthsForm  from './Components/AuthsForm';
import VideoUpload from './Components/VideoUpload';
import Home      from './Components/Home';
import { isAuthenticated } from './Auth';

// ─── Protected Route Wrapper ──────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
     
      <Routes>
        {/* Public Routes */}
        <Route path="/login"    element={<AuthsForm mode="login"    />} />
        <Route path="/register" element={<AuthsForm mode="register" />} />
        <Route path="/authsForm" element={<AuthsForm  />} />
        <Route path="/videoUpload" element={<VideoUpload/>} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}