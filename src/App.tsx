import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import TutorDashboard from './components/Dashboard/TutorDashboard';
import VideoPlayer from './components/Video/VideoPlayer';
import VideoUpload from './components/Upload/VideoUpload';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return user.role === 'student' ? <StudentDashboard /> : <TutorDashboard />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        {user && <Header />}
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/video/:id" 
            element={
              <ProtectedRoute>
                <VideoPlayer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <VideoUpload />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Router>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <VideoProvider>
        <AppContent />
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;