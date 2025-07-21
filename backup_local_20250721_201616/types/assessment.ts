export interface Question {
  id?: string;
  number: number;
  text: string;
  type: 'scale' | 'multiple_choice' | 'text' | 'date' | 'number';
  category: string;
  min?: number;
  max?: number;
  options?: string[];
  required?: boolean;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
  color?: string;
}

export interface AssessmentTool {
  id: string;
  name: string;
  description: string;
  sections: Section[];
  totalQuestions: number;
  estimatedTime: number;
  color?: string;
  instructions?: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  toolId: string;
  score: number;
  categories: Record<string, { score: number; total: number; average: number }>;
  answers: Record<string, any>;
  timestamp: string;
  overallScore: number;
}

export interface AssessmentAssignment {
  id: string;
  userId: string;
  toolId: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  instructions?: string;
  dueDate?: string;
  resultId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CoachingTool {
  id: string;
  name: string;
  description?: string;
  category?: string;
  total_questions: number;
  estimated_time: number;
  question_data: Question[];
  scoring_config?: Record<string, any>;
  instructions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
} 