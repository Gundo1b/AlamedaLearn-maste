import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useVideo } from '../../contexts/VideoContext';
import { formatDistanceToNow } from 'date-fns';
import { 
  ThumbsUp, 
  MessageCircle, 
  Eye, 
  Calendar, 
  Tag, 
  UserPlus, 
  ArrowLeft,
  Send
} from 'lucide-react';

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    getVideoById,
    getCommentsByVideoId,
    addComment,
    toggleLike,
    toggleSubscription,
    addToHistory,
    isLiked,
    isSubscribed,
    getSubscriptionCount,
    loading
  } = useVideo();

  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const video = id ? getVideoById(id) : undefined;
  const comments = id ? getCommentsByVideoId(id) : [];
  const isVideoLiked = user && id ? isLiked(id) : false;
  const isUserSubscribed = user && video ? isSubscribed(video.tutor_id) : false;
  const subscriberCount = video ? getSubscriptionCount(video.tutor_id) : 0;
  
  // Check role from multiple sources
  const userRole = (user?.publicMetadata?.role as string) || 
                   (user?.unsafeMetadata?.role as string) || 
                   localStorage.getItem('userRole');

  useEffect(() => {
    if (video && user) {
      addToHistory(video.id);
    }
  }, [video, user, addToHistory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Video not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    if (user) {
      try {
        await toggleLike(video.id);
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    }
  };

  const handleSubscribe = async () => {
    if (user && userRole === 'student') {
      try {
        await toggleSubscription(video.tutor_id);
      } catch (error) {
        console.error('Error toggling subscription:', error);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addComment(video.id, comment.trim());
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player and Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
                <video
                  controls
                  className="absolute inset-0 w-full h-full"
                  poster={video.thumbnail_url}
                >
                  <source src={video.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{video.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {formatNumber(video.views)} views
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {video.tutor?.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{video.tutor?.name || 'Unknown Tutor'}</h3>
                      <p className="text-sm text-gray-600">{formatNumber(subscriberCount)} subscribers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isVideoLiked
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{formatNumber(video.likes)}</span>
                    </button>
                    
                    {userRole === 'student' && (
                      <button
                        onClick={handleSubscribe}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isUserSubscribed
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>{isUserSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <p className="text-gray-700 mb-4">{video.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <MessageCircle className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Comments ({comments.length})
              </h3>
            </div>

            {user && (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {(user.firstName || user.emailAddresses[0].emailAddress).charAt(0)}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim() || isSubmittingComment}
                      className="mt-2 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmittingComment ? 'Posting...' : 'Comment'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {comment.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{comment.user?.name || 'Unknown User'}</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;