import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useVideo } from '../../contexts/VideoContext';
import VideoCard from '../Video/VideoCard';
import { 
  Upload, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Users, 
  Play,
  TrendingUp,
  Calendar
} from 'lucide-react';

const TutorDashboard: React.FC = () => {
  const { user } = useUser();
  const { 
    videos, 
    comments, 
    subscriptions, 
    getTutorVideos, 
    getSubscriptionCount,
    getCommentsByVideoId,
    loading
  } = useVideo();

  const [activeTab, setActiveTab] = useState('overview');

  // Get current user's profile ID from videos (since we need the profile ID, not clerk ID)
  const userVideos = videos.filter(video => video.tutor?.clerk_id === user?.id);
  const userProfileId = userVideos[0]?.tutor_id;
  
  const tutorVideos = userProfileId ? getTutorVideos(userProfileId) : [];
  const totalViews = tutorVideos.reduce((sum, video) => sum + video.views, 0);
  const totalLikes = tutorVideos.reduce((sum, video) => sum + video.likes, 0);
  const totalComments = tutorVideos.reduce((sum, video) => sum + getCommentsByVideoId(video.id).length, 0);
  const subscriberCount = userProfileId ? getSubscriptionCount(userProfileId) : 0;

  const stats = [
    {
      name: 'Total Videos',
      value: tutorVideos.length,
      icon: Play,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-green-500'
    },
    {
      name: 'Total Likes',
      value: totalLikes.toLocaleString(),
      icon: ThumbsUp,
      color: 'bg-purple-500'
    },
    {
      name: 'Subscribers',
      value: subscriberCount.toLocaleString(),
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'videos', label: 'My Videos' },
    { id: 'analytics', label: 'Analytics' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tutor Dashboard
            </h1>
            <p className="text-gray-600">Manage your content and track your performance</p>
          </div>
          <Link
            to="/upload"
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Video</span>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {tutorVideos.slice(0, 5).map((video) => (
                  <div key={video.id} className="flex items-center space-x-3">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-16 h-10 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-1">{video.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{video.views} views</span>
                        <span>{video.likes} likes</span>
                        <span>{getCommentsByVideoId(video.id).length} comments</span>
                      </div>
                    </div>
                  </div>
                ))}
                {tutorVideos.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No videos uploaded yet
                  </p>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Views per Video</span>
                  <span className="font-semibold">
                    {tutorVideos.length > 0 ? Math.round(totalViews / tutorVideos.length) : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Likes per Video</span>
                  <span className="font-semibold">
                    {tutorVideos.length > 0 ? Math.round(totalLikes / tutorVideos.length) : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Engagement Rate</span>
                  <span className="font-semibold">
                    {totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subscriber Growth</span>
                  <span className="font-semibold text-green-600">
                    +{subscriberCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <>
            {tutorVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tutorVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No videos uploaded yet</h3>
                <p className="text-gray-600 mb-4">Start sharing your knowledge with the world</p>
                <Link
                  to="/upload"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Your First Video</span>
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Video Analytics</h3>
            <div className="space-y-6">
              {tutorVideos.map((video) => {
                const videoComments = getCommentsByVideoId(video.id);
                return (
                  <div key={video.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{video.title}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span>{video.views} views</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ThumbsUp className="h-4 w-4 text-gray-400" />
                            <span>{video.likes} likes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4 text-gray-400" />
                            <span>{videoComments.length} comments</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            <span>{video.views > 0 ? ((video.likes / video.views) * 100).toFixed(1) : 0}% engagement</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {tutorVideos.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No analytics data available. Upload videos to see performance metrics.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;