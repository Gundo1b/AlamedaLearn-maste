import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Video } from 'lucide-react';

const RoleSelection: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async (role: 'student' | 'tutor') => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Use unsafeMetadata instead of publicMetadata as a workaround
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: role
        }
      });
      
      // Navigate to dashboard after successful role update
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating user role:', (error as any).message || JSON.stringify(error) || error);
      
      // If unsafeMetadata also fails, try storing in localStorage as fallback
      try {
        localStorage.setItem('userRole', role);
        navigate('/dashboard');
      } catch (storageError) {
        console.error('Failed to store role in localStorage:', storageError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Video className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to AlamedaLearn!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your role to get started
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
            I am a...
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setSelectedRole('student')}
              disabled={isLoading}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all text-left ${
                selectedRole === 'student' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Student</h4>
                  <p className="text-sm text-gray-600">Learn from expert tutors</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('tutor')}
              disabled={isLoading}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all text-left ${
                selectedRole === 'tutor' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Tutor</h4>
                  <p className="text-sm text-gray-600">Share your knowledge and teach</p>
                </div>
              </div>
            </button>
          </div>

          {selectedRole && (
            <div className="mt-6">
              <button
                onClick={() => handleRoleSelection(selectedRole)}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Setting up your account...' : `Continue as ${selectedRole}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;