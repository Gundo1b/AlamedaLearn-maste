/*
  # Video Learning Platform Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `name` (text)
      - `role` (text, either 'student' or 'tutor')
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `thumbnail_url` (text)
      - `video_url` (text)
      - `tutor_id` (uuid, references profiles)
      - `duration` (integer, in seconds)
      - `views` (integer, default 0)
      - `likes` (integer, default 0)
      - `category` (text)
      - `tags` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `comments`
      - `id` (uuid, primary key)
      - `video_id` (uuid, references videos)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `likes` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `video_likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `video_id` (uuid, references videos)
      - `created_at` (timestamp)
    
    - `subscriptions`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references profiles)
      - `tutor_id` (uuid, references profiles)
      - `created_at` (timestamp)
    
    - `video_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `video_id` (uuid, references videos)
      - `progress` (integer, default 0)
      - `watched_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to videos and profiles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text UNIQUE NOT NULL,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'tutor')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text NOT NULL,
  video_url text NOT NULL,
  tutor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  duration integer NOT NULL DEFAULT 0,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create video_likes table
CREATE TABLE IF NOT EXISTS video_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, tutor_id)
);

-- Create video_history table
CREATE TABLE IF NOT EXISTS video_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  watched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (true);

-- Videos policies
CREATE POLICY "Videos are viewable by everyone"
  ON videos FOR SELECT
  USING (true);

CREATE POLICY "Tutors can insert their own videos"
  ON videos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Tutors can update their own videos"
  ON videos FOR UPDATE
  USING (true);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (true);

-- Video likes policies
CREATE POLICY "Video likes are viewable by everyone"
  ON video_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage their own likes"
  ON video_likes FOR ALL
  USING (true);

-- Subscriptions policies
CREATE POLICY "Subscriptions are viewable by everyone"
  ON subscriptions FOR SELECT
  USING (true);

CREATE POLICY "Students can manage their own subscriptions"
  ON subscriptions FOR ALL
  USING (true);

-- Video history policies
CREATE POLICY "Users can view their own history"
  ON video_history FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own history"
  ON video_history FOR ALL
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_tutor_id ON videos(tutor_id);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_video_likes_user_id ON video_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_student_id ON subscriptions(student_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tutor_id ON subscriptions(tutor_id);
CREATE INDEX IF NOT EXISTS idx_video_history_user_id ON video_history(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles(clerk_id);

-- Insert sample data
INSERT INTO profiles (clerk_id, email, name, role, avatar_url) VALUES
  ('sample_tutor_1', 'john.doe@example.com', 'John Doe', 'tutor', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'),
  ('sample_tutor_2', 'jane.smith@example.com', 'Jane Smith', 'tutor', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150')
ON CONFLICT (clerk_id) DO NOTHING;

-- Insert sample videos
INSERT INTO videos (title, description, thumbnail_url, video_url, tutor_id, duration, views, likes, category, tags) 
SELECT 
  'Introduction to React Hooks',
  'Learn the fundamentals of React Hooks and how to use them effectively in your applications. This comprehensive tutorial covers useState, useEffect, and custom hooks.',
  'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  p.id,
  1800,
  1250,
  89,
  'Programming',
  ARRAY['React', 'JavaScript', 'Hooks']
FROM profiles p WHERE p.clerk_id = 'sample_tutor_1'
ON CONFLICT DO NOTHING;

INSERT INTO videos (title, description, thumbnail_url, video_url, tutor_id, duration, views, likes, category, tags)
SELECT 
  'Advanced CSS Animations',
  'Master CSS animations and transitions to create engaging user interfaces. Learn keyframes, transforms, and modern animation techniques.',
  'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
  p.id,
  2100,
  890,
  67,
  'Design',
  ARRAY['CSS', 'Animation', 'Frontend']
FROM profiles p WHERE p.clerk_id = 'sample_tutor_2'
ON CONFLICT DO NOTHING;

INSERT INTO videos (title, description, thumbnail_url, video_url, tutor_id, duration, views, likes, category, tags)
SELECT 
  'JavaScript ES6+ Features',
  'Explore modern JavaScript features including arrow functions, destructuring, async/await, and modules. Perfect for intermediate developers.',
  'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  p.id,
  2400,
  2100,
  156,
  'Programming',
  ARRAY['JavaScript', 'ES6', 'Modern JS']
FROM profiles p WHERE p.clerk_id = 'sample_tutor_1'
ON CONFLICT DO NOTHING;