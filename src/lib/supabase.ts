import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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