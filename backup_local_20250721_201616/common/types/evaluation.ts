// Tipos para Avaliação Semanal
export interface WeeklyEvaluation {
  id: string;
  user_id: string;
  week_start: string; // YYYY-MM-DD
  emotional_state: string;
  comments?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyEvaluationMetric {
  id: string;
  evaluation_id: string;
  question_key: string;
  rating: number;
  created_at: string;
} 