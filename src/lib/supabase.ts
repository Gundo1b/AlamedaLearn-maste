import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// File upload utilities
export const uploadFile = async (file: File, bucket: string, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
};

export const uploadVideo = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  return uploadFile(file, 'videos', fileName);
};

export const uploadThumbnail = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  return uploadFile(file, 'thumbnails', fileName);
};

// Generate video thumbnail from video file
export const generateThumbnail = (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to 10% of video duration for thumbnail
      video.currentTime = video.duration * 0.1;
    });

    video.addEventListener('seeked', () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
            resolve(URL.createObjectURL(thumbnailFile));
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        }, 'image/jpeg', 0.8);
      }
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video for thumbnail generation'));
    });

    video.src = URL.createObjectURL(videoFile);
    video.load();
  });
};

// Get video duration
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    
    video.addEventListener('loadedmetadata', () => {
      resolve(Math.round(video.duration));
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });

    video.src = URL.createObjectURL(file);
    video.load();
  });
};

// Database types
export interface Profile {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  role: 'student' | 'tutor';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  tutor_id: string;
  duration: number;
  views: number;
  likes: number;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  // Joined data
  tutor?: Profile;
}

export interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  content: string;
  likes: number;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: Profile;
}

export interface VideoLike {
  id: string;
  user_id: string;
  video_id: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  student_id: string;
  tutor_id: string;
  created_at: string;
}

export interface VideoHistory {
  id: string;
  user_id: string;
  video_id: string;
  progress: number;
  watched_at: string;
  created_at: string;
  updated_at: string;
}