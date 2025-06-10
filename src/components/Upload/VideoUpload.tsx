import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useVideo } from '../../contexts/VideoContext';
import { Upload, Video, Image, Tag, FileText, ArrowLeft } from 'lucide-react';

const VideoUpload: React.FC = () => {
  const { user } = useAuth();
  const { uploadVideo } = useVideo();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    tags: '',
    thumbnailUrl: '',
    videoUrl: '',
    duration: 0
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Programming', 'Design', 'Business', 'Science', 'Language', 'Other'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to upload videos');
      return;
    }

    if (!formData.title || !formData.description || !formData.videoUrl) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      const videoData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        thumbnailUrl: formData.thumbnailUrl || 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=800',
        videoUrl: formData.videoUrl,
        duration: formData.duration || 1800,
        tutorId: user.id,
        tutorName: user.name,
        tutorAvatar: user.avatar
      };

      uploadVideo(videoData);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (user?.role !== 'tutor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only tutors can upload videos</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Upload className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Upload New Video</h1>
            </div>
            <p className="text-gray-600 mt-2">Share your knowledge with students around the world</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Video Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter an engaging title for your video"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what students will learn from this video..."
              />
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., React, JavaScript, Beginner"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>

            {/* Video URL */}
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Video URL *
              </label>
              <div className="relative">
                <Video className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  required
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/your-video.mp4"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Direct link to your video file (MP4 format recommended)
              </p>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="url"
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Optional: A default thumbnail will be used if not provided
              </p>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                min="0"
                value={formData.duration}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1800"
              />
              <p className="text-xs text-gray-500 mt-1">
                Video duration in seconds (e.g., 1800 for 30 minutes)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;