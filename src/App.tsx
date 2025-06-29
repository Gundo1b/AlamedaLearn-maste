import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { VideoProvider } from './contexts/VideoContext';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import TutorDashboard from './components/Dashboard/TutorDashboard';
import VideoPlayer from './components/Video/VideoPlayer';
import VideoUpload from './components/Upload/VideoUpload';
import RoleSelection from './components/Auth/RoleSelection';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  
  if (!user) return null;
  
  // Check if user has selected a role
  const userRole = user.publicMetadata?.role as string;
  
  if (!userRole) {
    return <RoleSelection />;
  }
  
  return userRole === 'student' ? <StudentDashboard /> : <TutorDashboard />;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <SignedIn>
          <Header />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/upload" element={<VideoUpload />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </SignedIn>
        
        <SignedOut>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </SignedOut>
      </Router>
    </div>
  );
};

function App() {
  return (
    <VideoProvider>
      <AppContent />
    </VideoProvider>
  );
}

export default App;