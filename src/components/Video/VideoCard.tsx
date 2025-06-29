import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Play, Eye, ThumbsUp, Clock } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    <Link to={`/video/${video.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="relative">
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDuration(video.duration)}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {video.tutor?.name?.charAt(0) || 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{video.tutor?.name || 'Unknown Tutor'}</p>
              <div className="flex items-center text-xs text-gray-500 mt-2 space-x-4">
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {formatNumber(video.views)} views
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  {formatNumber(video.likes)}
                </div>
                <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {video.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;