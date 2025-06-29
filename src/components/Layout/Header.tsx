import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Video, Upload, Home } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Check role from multiple sources
  const userRole = (user?.publicMetadata?.role as string) || 
                   (user?.unsafeMetadata?.role as string) || 
                   localStorage.getItem('userRole');

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AlamedaLearn</span>
          </Link>

          {user && (
            <nav className="flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              {userRole === 'tutor' && (
                <Link
                  to="/upload"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Link>
              )}

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{user.firstName || user.emailAddresses[0].emailAddress}</span>
                  {userRole && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {userRole}
                    </span>
                  )}
                </div>
                
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;