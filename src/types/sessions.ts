// Tipos para o sistema de sessões de coaching

export interface CoachingTool {
  id: number;
  name: string;
  description: string;
  category: string;
  total_questions: number;
  estimated_time: number; // em minutos
  question_data: Question[];
  scoring_config: ScoringConfig;
  created_at: string;
  updated_at: string;
}

export interface Question {
  number: number;
  text: string;
  type: 'scale' | 'multiple_choice' | 'text';
  category: string;
  options?: string[]; // para multiple_choice
  min?: number; // para scale
  max?: number; // para scale
}

export interface ScoringConfig {
  categories: string[];
  max_score?: number;
  scoring?: Record<string, number>; // para multiple_choice
  interpretation: Record<string, string>;
}

export interface CoachingSession {
  id: number;
  user_id: string;
  tool_id: number;
  admin_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string;
  started_at?: string;
  completed_at?: string;
  instructions?: string;
  progress: {
    current_question: number;
    total_questions: number;
  };
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  tool?: CoachingTool;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
  admin?: {
    id: string;
    email: string;
    full_name?: string;
  };
  responses?: SessionResponse[];
  result?: SessionResult;
}

export interface SessionResponse {
  id: number;
  session_id: number;
  question_number: number;
  question_text: string;
  response: string;
  response_type: 'scale' | 'multiple_choice' | 'text';
  response_value?: number;
  category: string;
  created_at: string;
}

export interface SessionResult {
  id: number;
  session_id: number;
  total_score?: number;
  category_scores: Record<string, number>;
  insights: string[];
  recommendations: string[];
  summary?: string;
  created_at: string;
}

export interface SessionProgress {
  current_question: number;
  total_questions: number;
  percentage: number;
  responses: SessionResponse[];
}

export interface SessionFilters {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  tool_id?: number;
  user_id?: string;
  admin_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface SessionStats {
  total_sessions: number;
  pending_sessions: number;
  in_progress_sessions: number;
  completed_sessions: number;
  cancelled_sessions: number;
  total_users: number;
  completion_rate: number;
  average_completion_time: number; // em minutos
  most_used_tools: Array<{
    tool_name: string;
    usage_count: number;
  }>;
}

export interface CreateSessionRequest {
  user_id: string;
  tool_id: number;
  scheduled_date: string;
  instructions?: string;
}

export interface UpdateSessionRequest {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date?: string;
  instructions?: string;
  progress?: {
    current_question: number;
    total_questions: number;
  };
}

export interface SubmitResponseRequest {
  session_id: number;
  question_number: number;
  question_text: string;
  response: string;
  response_type: 'scale' | 'multiple_choice' | 'text';
  response_value?: number;
  category: string;
} 