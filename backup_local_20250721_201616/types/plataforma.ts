export interface Course {
  id: string;
  title: string;
  description: string;
  type: 'CURSO' | 'MÓDULO' | 'AULA';
  image_url: string;
  video_url?: string;
  show_title: boolean;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  video_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContentBlock {
  id: string;
  lesson_id: string;
  type: 'video' | 'text' | 'image' | 'quiz';
  content: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface CourseCardProps {
  id: string;
  title: string;
  type: 'CURSO' | 'MÓDULO' | 'AULA';
  imageUrl: string;
  showTitle?: boolean;
  onClick?: () => void;
}

export interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ModernVideoPlayerProps {
  videoUrl: string;
  title: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
} 