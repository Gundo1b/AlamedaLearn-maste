import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase, Video, Comment, VideoLike, Subscription, VideoHistory, Profile } from '../lib/supabase';

interface VideoContextType {
  videos: Video[];
  comments: Comment[];
  likes: VideoLike[];
  subscriptions: Subscription[];
  videoHistory: VideoHistory[];
  loading: boolean;
  uploadVideo: (videoData: Omit<Video, 'id' | 'views' | 'likes' | 'created_at' | 'updated_at' | 'tutor'>) => Promise<void>;
  addComment: (videoId: string, content: string) => Promise<void>;
  toggleLike: (videoId: string) => Promise<void>;
  toggleSubscription: (tutorId: string) => Promise<void>;
  addToHistory: (videoId: string) => Promise<void>;
  getVideoById: (id: string) => Video | undefined;
  getCommentsByVideoId: (videoId: string) => Comment[];
  isLiked: (videoId: string) => boolean;
  isSubscribed: (tutorId: string) => boolean;
  getSubscriptionCount: (tutorId: string) => number;
  getTutorVideos: (tutorId: string) => Video[];
  refreshData: () => Promise<void>;
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
  const { user } = useUser();
  const [videos, setVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<VideoLike[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [videoHistory, setVideoHistory] = useState<VideoHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  // Create or get user profile
  const ensureUserProfile = async () => {
    if (!user) return null;

    try {
      // First, try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_id', user.id)
        .single();

      if (existingProfile && !fetchError) {
        setUserProfile(existingProfile);
        return existingProfile;
      }

      // If profile doesn't exist, create it
      const userRole = (user.publicMetadata?.role as string) || 
                       (user.unsafeMetadata?.role as string) || 
                       localStorage.getItem('userRole') || 
                       'student';

      const newProfile = {
        clerk_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.firstName || user.emailAddresses[0]?.emailAddress || 'User',
        role: userRole as 'student' | 'tutor',
        avatar_url: user.imageUrl
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return null;
      }

      setUserProfile(createdProfile);
      return createdProfile;
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      return null;
    }
  };

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);

      // Load videos with tutor information
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select(`
          *,
          tutor:profiles!videos_tutor_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (videosError) throw videosError;
      setVideos(videosData || []);

      // Load comments with user information
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles!comments_user_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);

      // Load likes
      const { data: likesData, error: likesError } = await supabase
        .from('video_likes')
        .select('*');

      if (likesError) throw likesError;
      setLikes(likesData || []);

      // Load subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*');

      if (subscriptionsError) throw subscriptionsError;
      setSubscriptions(subscriptionsData || []);

      // Load video history
      const { data: historyData, error: historyError } = await supabase
        .from('video_history')
        .select('*')
        .order('watched_at', { ascending: false });

      if (historyError) throw historyError;
      setVideoHistory(historyData || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data when user changes
  useEffect(() => {
    if (user) {
      ensureUserProfile().then(() => {
        loadData();
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const uploadVideo = async (videoData: Omit<Video, 'id' | 'views' | 'likes' | 'created_at' | 'updated_at' | 'tutor'>) => {
    if (!userProfile) throw new Error('User profile not found');

    const { data, error } = await supabase
      .from('videos')
      .insert([{
        ...videoData,
        tutor_id: userProfile.id
      }])
      .select(`
        *,
        tutor:profiles!videos_tutor_id_fkey(*)
      `)
      .single();

    if (error) throw error;

    setVideos(prev => [data, ...prev]);
  };

  const addComment = async (videoId: string, content: string) => {
    if (!userProfile) throw new Error('User profile not found');

    const { data, error } = await supabase
      .from('comments')
      .insert([{
        video_id: videoId,
        user_id: userProfile.id,
        content
      }])
      .select(`
        *,
        user:profiles!comments_user_id_fkey(*)
      `)
      .single();

    if (error) throw error;

    setComments(prev => [data, ...prev]);
  };

  const toggleLike = async (videoId: string) => {
    if (!userProfile) throw new Error('User profile not found');

    const existingLike = likes.find(like => like.video_id === videoId && like.user_id === userProfile.id);

    if (existingLike) {
      // Remove like
      const { error } = await supabase
        .from('video_likes')
        .delete()
        .eq('id', existingLike.id);

      if (error) throw error;

      setLikes(prev => prev.filter(like => like.id !== existingLike.id));

      // Update video likes count
      const { error: updateError } = await supabase
        .from('videos')
        .update({ likes: Math.max(0, (videos.find(v => v.id === videoId)?.likes || 1) - 1) })
        .eq('id', videoId);

      if (updateError) throw updateError;

      setVideos(prev => prev.map(video => 
        video.id === videoId ? { ...video, likes: Math.max(0, video.likes - 1) } : video
      ));
    } else {
      // Add like
      const { data, error } = await supabase
        .from('video_likes')
        .insert([{
          user_id: userProfile.id,
          video_id: videoId
        }])
        .select()
        .single();

      if (error) throw error;

      setLikes(prev => [...prev, data]);

      // Update video likes count
      const { error: updateError } = await supabase
        .from('videos')
        .update({ likes: (videos.find(v => v.id === videoId)?.likes || 0) + 1 })
        .eq('id', videoId);

      if (updateError) throw updateError;

      setVideos(prev => prev.map(video => 
        video.id === videoId ? { ...video, likes: video.likes + 1 } : video
      ));
    }
  };

  const toggleSubscription = async (tutorId: string) => {
    if (!userProfile || userProfile.role !== 'student') throw new Error('Only students can subscribe');

    const existingSubscription = subscriptions.find(
      sub => sub.tutor_id === tutorId && sub.student_id === userProfile.id
    );

    if (existingSubscription) {
      // Remove subscription
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', existingSubscription.id);

      if (error) throw error;

      setSubscriptions(prev => prev.filter(sub => sub.id !== existingSubscription.id));
    } else {
      // Add subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{
          student_id: userProfile.id,
          tutor_id: tutorId
        }])
        .select()
        .single();

      if (error) throw error;

      setSubscriptions(prev => [...prev, data]);
    }
  };

  const addToHistory = async (videoId: string) => {
    if (!userProfile) return;

    const existingHistory = videoHistory.find(
      history => history.video_id === videoId && history.user_id === userProfile.id
    );

    if (existingHistory) {
      // Update existing history
      const { data, error } = await supabase
        .from('video_history')
        .update({ watched_at: new Date().toISOString() })
        .eq('id', existingHistory.id)
        .select()
        .single();

      if (error) throw error;

      setVideoHistory(prev => prev.map(history =>
        history.id === existingHistory.id ? data : history
      ));
    } else {
      // Add new history entry
      const { data, error } = await supabase
        .from('video_history')
        .insert([{
          user_id: userProfile.id,
          video_id: videoId,
          progress: 0
        }])
        .select()
        .single();

      if (error) throw error;

      setVideoHistory(prev => [data, ...prev]);
    }

    // Increment video views
    const video = videos.find(v => v.id === videoId);
    if (video) {
      const { error: updateError } = await supabase
        .from('videos')
        .update({ views: video.views + 1 })
        .eq('id', videoId);

      if (!updateError) {
        setVideos(prev => prev.map(v => 
          v.id === videoId ? { ...v, views: v.views + 1 } : v
        ));
      }
    }
  };

  const getVideoById = (id: string) => videos.find(video => video.id === id);
  const getCommentsByVideoId = (videoId: string) => comments.filter(comment => comment.video_id === videoId);
  const isLiked = (videoId: string) => userProfile ? likes.some(like => like.video_id === videoId && like.user_id === userProfile.id) : false;
  const isSubscribed = (tutorId: string) => userProfile ? subscriptions.some(sub => sub.tutor_id === tutorId && sub.student_id === userProfile.id) : false;
  const getSubscriptionCount = (tutorId: string) => subscriptions.filter(sub => sub.tutor_id === tutorId).length;
  const getTutorVideos = (tutorId: string) => videos.filter(video => video.tutor_id === tutorId);

  const refreshData = async () => {
    await loadData();
  };

  return (
    <VideoContext.Provider value={{
      videos,
      comments,
      likes,
      subscriptions,
      videoHistory,
      loading,
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
      getTutorVideos,
      refreshData
    }}>
      {children}
    </VideoContext.Provider>
  );
};