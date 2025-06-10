export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'tutor';
  avatar?: string;
  createdAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  duration: number;
  views: number;
  likes: number;
  createdAt: Date;
  category: string;
  tags: string[];
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  likes: number;
}

export interface Subscription {
  id: string;
  studentId: string;
  tutorId: string;
  createdAt: Date;
}

export interface VideoHistory {
  id: string;
  userId: string;
  videoId: string;
  watchedAt: Date;
  progress: number;
}

export interface Like {
  id: string;
  userId: string;
  videoId: string;
  createdAt: Date;
}