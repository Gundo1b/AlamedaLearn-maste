import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useVideo } from '../../contexts/VideoContext';
import VideoCard from '../Video/VideoCard';
import { Search, Filter, History, Users, Play } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { videos, videoHistory, subscriptions } = useVideo();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('browse');

  const categories = ['all', 'Programming', 'Design', 'Business', 'Science', 'Language'];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tutorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const userHistory = user ? videoHistory.filter(h => h.userId === user.id) : [];
  const historyVideos = userHistory.map(h => videos.find(v => v.id === h.videoId)).filter(Boolean);

  const userSubscriptions = user ? subscriptions.filter(s => s.studentId === user.id) : [];
  const subscribedTutors = userSubscriptions.map(s => s.tutorId);
  const subscribedVideos = videos.filter(v => subscribedTutors.includes(v.tutorId));

  const tabs = [
    { id: 'browse', label: 'Browse', icon: Search },
    { id: 'subscriptions', label: 'Subscriptions', icon: Users },
    { id: 'history', label: 'History', icon: History }
  ];

  const renderVideoGrid = (videosToRender: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videosToRender.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Discover new knowledge and continue your learning journey</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <>
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search videos, tutors, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Video Grid */}
            {filteredVideos.length > 0 ? (
              renderVideoGrid(filteredVideos)
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <>
            {subscribedVideos.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Latest from your subscriptions
                  </h2>
                  <p className="text-gray-600">
                    You're subscribed to {userSubscriptions.length} tutor{userSubscriptions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {renderVideoGrid(subscribedVideos)}
              </>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
                <p className="text-gray-600">Subscribe to tutors to see their latest videos here</p>
              </div>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <>
            {historyVideos.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Watch History
                  </h2>
                  <p className="text-gray-600">
                    You've watched {historyVideos.length} video{historyVideos.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {renderVideoGrid(historyVideos)}
              </>
            ) : (
              <div className="text-center py-12">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No watch history</h3>
                <p className="text-gray-600">Videos you watch will appear here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;