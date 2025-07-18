// Interfaces para o sistema administrativo
export interface UserAuth {
  id: string;
  email: string;
  aud: string;
  role?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

export interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'client' | 'visitor';
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface PhysicalData {
  id: string;
  user_id: string;
  altura_cm: number;
  peso_atual_kg: number;
  circunferencia_abdominal_cm?: number;
  imc: number;
  meta_peso_kg?: number;
  updated_at: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'client' | 'visitor';
  avatar_url?: string;
  phone?: string;
  birth_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  category: string;
  price: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  video_url?: string;
  content_text?: string;
  duration_minutes?: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  progress_percentage: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action_type: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW';
  target_table: string;
  target_id?: string;
  details: Record<string, any>;
  created_at: string;
}

export interface MissaoDia {
  id?: string;
  user_id: string;
  data: string;
  inspira?: string;
  humor?: string;
  prioridades?: string[];
  mensagem_dia?: string;
  momento_feliz?: string;
  tarefa_bem_feita?: string;
  habito_saudavel?: string;
  gratidao?: string;
  concluido?: boolean;
  // Campos adicionais
  liquido_ao_acordar?: string;
  pratica_conexao?: string;
  energia_ao_acordar?: number;
  sono_horas?: number;
  agua_litros?: string;
  atividade_fisica?: boolean;
  estresse_nivel?: number;
  fome_emocional?: boolean;
  pequena_vitoria?: string;
  intencao_para_amanha?: string;
  nota_dia?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ChartDataPoint {
  data: string;
  peso: number;
  imc: number;
  gordura: number;
  musculo: number;
  agua: number;
  data_medicao: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  target?: string;
  progress?: number;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Tipos para validação
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
}

// Tipos para configuração
export interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  adminEmails: string[];
  appName: string;
  appVersion: string;
  debugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
} 