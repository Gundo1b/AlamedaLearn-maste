import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Video, Comment, Like, Subscription, VideoHistory } from '../types';

interface VideoContextType {
  videos: Video[];
  comments: Comment[];
  likes: Like[];
  subscriptions: Subscription[];
  videoHistory: VideoHistory[];
  uploadVideo: (videoData: Omit<Video, 'id' | 'views' | 'likes' | 'createdAt'>) => void;
  addComment: (videoId: string, content: string, userId: string, userName: string) => void;
  toggleLike: (videoId: string, userId: string) => void;
  toggleSubscription: (tutorId: string, studentId: string) => void;
  addToHistory: (videoId: string, userId: string) => void;
  getVideoById: (id: string) => Video | undefined;
  getCommentsByVideoId: (videoId: string) => Comment[];
  isLiked: (videoId: string, userId: string) => boolean;
  isSubscribed: (tutorId: string, studentId: string) => boolean;
  getSubscriptionCount: (tutorId: string) => number;
  getTutorVideos: (tutorId: string) => Video[];
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [videoHistory, setVideoHistory] = useState<VideoHistory[]>([]);

  useEffect(() => {
    // Load data from localStorage on app start
    const savedVideos = localStorage.getItem('videos');
    const savedComments = localStorage.getItem('comments');
    const savedLikes = localStorage.getItem('likes');
    const savedSubscriptions = localStorage.getItem('subscriptions');
    const savedHistory = localStorage.getItem('videoHistory');

    if (savedVideos) setVideos(JSON.parse(savedVideos));
    if (savedComments) setComments(JSON.parse(savedComments));
    if (savedLikes) setLikes(JSON.parse(savedLikes));
    if (savedSubscriptions) setSubscriptions(JSON.parse(savedSubscriptions));
    if (savedHistory) setVideoHistory(JSON.parse(savedHistory));

    // Add sample data if no videos exist
    if (!savedVideos || JSON.parse(savedVideos).length === 0) {
      const sampleVideos: Video[] = [
        {
          id: '1',
          title: 'Introduction to React Hooks',
          description: 'Learn the fundamentals of React Hooks and how to use them effectively in your applications.',
          thumbnailUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          tutorId: 'tutor1',
          tutorName: 'John Doe',
          duration: 1800,
          views: 1250,
          likes: 89,
          createdAt: new Date('2024-01-15'),
          category: 'Programming',
          tags: ['React', 'JavaScript', 'Hooks']
        },
        {
          id: '2',
          title: 'Advanced CSS Animations',
          description: 'Master CSS animations and transitions to create engaging user interfaces.',
          thumbnailUrl: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
          tutorId: 'tutor2',
          tutorName: 'Jane Smith',
          duration: 2100,
          views: 890,
          likes: 67,
          createdAt: new Date('2024-01-10'),
          category: 'Design',
          tags: ['CSS', 'Animation', 'Frontend']
        }
      ];
      setVideos(sampleVideos);
      localStorage.setItem('videos', JSON.stringify(sampleVideos));
    }
  }, []);

  const uploadVideo = (videoData: Omit<Video, 'id' | 'views' | 'likes' | 'createdAt'>) => {
    const newVideo: Video = {
      ...videoData,
      id: Date.now().toString(),
      views: 0,
      likes: 0,
      createdAt: new Date()
    };

    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    localStorage.setItem('videos', JSON.stringify(updatedVideos));
  };

  const addComment = (videoId: string, content: string, userId: string, userName: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      videoId,
      userId,
      userName,
      content,
      createdAt: new Date(),
      likes: 0
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  const toggleLike = (videoId: string, userId: string) => {
    const existingLike = likes.find(like => like.videoId === videoId && like.userId === userId);
    
    if (existingLike) {
      // Remove like
      const updatedLikes = likes.filter(like => like.id !== existingLike.id);
      setLikes(updatedLikes);
      localStorage.setItem('likes', JSON.stringify(updatedLikes));
      
      // Update video likes count
      const updatedVideos = videos.map(video => 
        video.id === videoId ? { ...video, likes: video.likes - 1 } : video
      );
      setVideos(updatedVideos);
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
    } else {
      // Add like
      const newLike: Like = {
        id: Date.now().toString(),
        userId,
        videoId,
        createdAt: new Date()
      };
      
      const updatedLikes = [...likes, newLike];
      setLikes(updatedLikes);
      localStorage.setItem('likes', JSON.stringify(updatedLikes));
      
      // Update video likes count
      const updatedVideos = videos.map(video => 
        video.id === videoId ? { ...video, likes: video.likes + 1 } : video
      );
      setVideos(updatedVideos);
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
    }
  };

  const toggleSubscription = (tutorId: string, studentId: string) => {
    const existingSubscription = subscriptions.find(
      sub => sub.tutorId === tutorId && sub.studentId === studentId
    );
    
    if (existingSubscription) {
      // Remove subscription
      const updatedSubscriptions = subscriptions.filter(sub => sub.id !== existingSubscription.id);
      setSubscriptions(updatedSubscriptions);
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
    } else {
      // Add subscription
      const newSubscription: Subscription = {
        id: Date.now().toString(),
        studentId,
        tutorId,
        createdAt: new Date()
      };
      
      const updatedSubscriptions = [...subscriptions, newSubscription];
      setSubscriptions(updatedSubscriptions);
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
    }
  };

  const addToHistory = (videoId: string, userId: string) => {
    const existingHistory = videoHistory.find(
      history => history.videoId === videoId && history.userId === userId
    );
    
    if (existingHistory) {
      // Update existing history
      const updatedHistory = videoHistory.map(history =>
        history.id === existingHistory.id
          ? { ...history, watchedAt: new Date() }
          : history
      );
      setVideoHistory(updatedHistory);
      localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
    } else {
      // Add new history entry
      const newHistory: VideoHistory = {
        id: Date.now().toString(),
        userId,
        videoId,
        watchedAt: new Date(),
        progress: 0
      };
      
      const updatedHistory = [...videoHistory, newHistory];
      setVideoHistory(updatedHistory);
      localStorage.setItem('videoHistory', JSON.stringify(updatedHistory));
    }
  };

  const getVideoById = (id: string) => videos.find(video => video.id === id);
  const getCommentsByVideoId = (videoId: string) => comments.filter(comment => comment.videoId === videoId);
  const isLiked = (videoId: string, userId: string) => likes.some(like => like.videoId === videoId && like.userId === userId);
  const isSubscribed = (tutorId: string, studentId: string) => subscriptions.some(sub => sub.tutorId === tutorId && sub.studentId === studentId);
  const getSubscriptionCount = (tutorId: string) => subscriptions.filter(sub => sub.tutorId === tutorId).length;
  const getTutorVideos = (tutorId: string) => videos.filter(video => video.tutorId === tutorId);

  return (
    <VideoContext.Provider value={{
      videos,
      comments,
      likes,
      subscriptions,
      videoHistory,
      uploadVideo,
      addComment,
      toggleLike,
      toggleSubscription,
      addToHistory,
      getVideoById,
      getCommentsByVideoId,
      isLiked,
      isSubscribed,
      getSubscriptionCount,
      getTutorVideos
    }}>
      {children}
    </VideoContext.Provider>
  );
};