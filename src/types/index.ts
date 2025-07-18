// ====================================================================
// TIPOS CENTRALIZADOS E PADRONIZADOS
// ====================================================================

// === TIPOS BASE ===
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface UserEntity extends BaseEntity {
  user_id: string;
}

// === TIPOS DE USUÁRIO ===
export type UserRole = 'admin' | 'client' | 'visitor';

export type InteractionType = 'diary' | 'session' | 'test' | 'comment' | 'favorite';

export interface UserProfile extends UserEntity {
  full_name: string;
  email: string;
  celular?: string;
  data_nascimento?: string;
  sexo?: 'masculino' | 'feminino' | 'outro';
  role: UserRole;
  is_active: boolean;
}

// === DADOS FÍSICOS E DE SAÚDE ===
export interface PhysicalData extends UserEntity {
  nome_completo: string;
  sexo: 'masculino' | 'feminino' | 'outro';
  data_nascimento: string;
  altura_cm: number;
  peso_atual_kg: number;
  circunferencia_abdominal_cm: number;
  imc?: number;
  meta_peso_kg?: number;
  categoria_imc?: string;
  risco_cardiometabolico?: string;
}

export interface HealthData extends UserEntity {
  peso_atual_kg: number;
  altura_cm: number;
  circunferencia_abdominal_cm: number;
  meta_peso_kg: number;
  imc?: number;
  progresso_percentual?: number;
  data_atualizacao?: string;
}

export interface WeightMeasurement extends UserEntity {
  peso_kg: number;
  imc?: number;
  circunferencia_abdominal_cm?: number;
  idade_metabolica?: number;
  gordura_corporal_pct?: number;
  massa_muscular_kg?: number;
  agua_corporal_pct?: number;
  gordura_visceral?: number;
  taxa_metabolica_basal?: number;
  massa_ossea_kg?: number;
  tipo_corpo?: string;
  origem_medicao: 'manual' | 'bluetooth' | 'api' | 'import';
  data_medicao: string;
}

// === BLUETOOTH E BALANÇA ===
export interface BluetoothScaleReading {
  weight: number;
  impedance?: number;
  bodyFat?: number;
  bodyWater?: number;
  muscleMass?: number;
  visceralFat?: number;
  basalMetabolism?: number;
  bodyAge?: number;
  bodyType?: string;
  timestamp: Date;
}

export interface BluetoothScaleState {
  isConnected: boolean;
  isConnecting: boolean;
  isReading: boolean;
  device: any | null; // BluetoothDevice será tipado pelos hooks que o utilizam
  lastReading: BluetoothScaleReading | null;
  countdown: number;
  status: string;
}

// Tipos Web Bluetooth - estendendo os tipos existentes
export interface BluetoothRequestOptions {
  filters: { namePrefix: string }[];
  optionalServices: string[];
}

// === MISSÕES E PONTUAÇÃO ===
export interface DailyMission extends UserEntity {
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
  // Campos de saúde
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
}

export interface DailyPoints extends UserEntity {
  data: string;
  pontos_liquido_manha: number;
  pontos_conexao_interna: number;
  pontos_energia_acordar: number;
  pontos_sono: number;
  pontos_agua: number;
  pontos_atividade_fisica: number;
  pontos_estresse: number;
  pontos_fome_emocional: number;
  pontos_gratidao: number;
  pontos_pequena_vitoria: number;
  pontos_intencao_amanha: number;
  pontos_avaliacao_dia: number;
  total_pontos_dia: number;
  categoria_dia: 'baixa' | 'medio' | 'excelente';
}

// === AVALIAÇÕES SEMANAIS ===
export interface WeeklyEvaluation extends UserEntity {
  week_start_date: string;
  learning_data: {
    melhor_acontecimento?: string;
    maior_desafio?: string;
    conselho_mentor?: string;
    maior_aprendizado_sabotador?: string;
    momento_percebi_sabotando?: string;
    nome_semana?: string;
    relacao_ultima_semana?: string;
  };
  performance_ratings: {
    [key: string]: number;
  };
  next_week_goals?: string;
}

// === CURSOS ===
export interface Course extends BaseEntity {
  title: string;
  description: string;
  image_url: string;
  category: string;
  price: number;
  is_active: boolean;
  instructor?: string;
  duration?: string;
  rating?: number;
  students_count?: number;
  progress?: number;
  status?: 'not-started' | 'in-progress' | 'completed';
}

export interface CourseModule extends BaseEntity {
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  is_active: boolean;
}

export interface CourseLesson extends BaseEntity {
  module_id: string;
  title: string;
  content: string;
  video_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_active: boolean;
}

// === METAS ===
export interface Goal extends UserEntity {
  name: string;
  type: 'emagrecer' | 'melhorar-sono' | 'ganhar-massa' | 'reduzir-ansiedade' | 
        'melhorar-alimentacao' | 'criar-habito' | 'reduzir-dor' | 'outro';
  start_date: string;
  target_date: string;
  notes: string;
  progress: number;
  other_type?: string;
  weekly_reminders: boolean;
  automatic_plan: boolean;
}

// === DESAFIOS ===
export interface Challenge extends BaseEntity {
  title: string;
  description: string;
  category: string;
  level: string;
  points: number;
  duration_days: number;
  is_active: boolean;
  icon?: string;
}

// === INTEGRAÇÃO DE SAÚDE ===
export interface HealthIntegrationData {
  weight?: {
    value: number;
    unit: 'kg' | 'lbs';
    timestamp: Date;
  };
  height?: {
    value: number;
    unit: 'cm' | 'in';
    timestamp: Date;
  };
  bodyComposition?: {
    bodyFat?: number;
    muscleMass?: number;
    bodyWater?: number;
    timestamp: Date;
  };
  vitals?: {
    heartRate?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    timestamp: Date;
  };
  activity?: {
    steps?: number;
    calories?: number;
    activeMinutes?: number;
    timestamp: Date;
  };
  sleep?: {
    duration: number; // em minutos
    quality?: 'poor' | 'fair' | 'good' | 'excellent';
    timestamp: Date;
  };
  nutrition?: {
    water?: number; // em ml
    calories?: number;
    timestamp: Date;
  };
}

export interface GoogleFitData extends HealthIntegrationData {
  source: 'google_fit';
}

export interface AppleHealthData extends HealthIntegrationData {
  source: 'apple_health';
}

// === DADOS DE PROGRESSO ===
export interface ProgressData {
  weightMeasurements: WeightMeasurement[];
  physicalData: PhysicalData | null;
  measurementHistory: any[];
  weightGoals: Goal[];
  loading: boolean;
  error: string | null;
}

// === BACKUP E DADOS ===
export interface BackupData extends UserEntity {
  data: any;
  backup_type: 'manual' | 'automatic';
  size_bytes: number;
}

// === DADOS DE VISITANTE ===
export interface VisitorData {
  sessionProgress: Record<string, number>;
  sessionResponses: Record<string, string[]>;
  completedSessions: string[];
  lastActiveSession?: string;
  timeSpent: number;
  favoriteContent: string[];
}

// === SISTEMA DE REGISTRO ===
export interface RegistrationData {
  fullName: string;
  email: string;
  dataNascimento: string;
  sexo: 'masculino' | 'feminino' | 'outro';
  altura: number;
  pesoAtual: number;
  circunferenciaAbdominal: number;
  celular?: string;
  metaPeso?: number;
}

export interface RegistrationResult {
  success: boolean;
  message: string;
  profile_id?: string;
  health_check?: HealthCheckResult;
}

export interface HealthCheckResult {
  imc: number;
  categoria_imc: string;
  risco_cardiometabolico: string;
  recomendacoes: string[];
}

// === HOOKS TYPES ===
export interface UseAuthReturn {
  user: any | null;
  session: any | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string, celular?: string, 
           dataNascimento?: string, sexo?: string, altura?: number) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
}

export interface UsePhysicalDataReturn {
  isComplete: boolean | null;
  isLoading: boolean;
  checkPhysicalDataComplete: (force?: boolean) => Promise<void>;
  markAsComplete: () => void;
  clearCache: () => void;
  hasChecked: boolean;
}

// === RESPONSE TYPES ===
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// === UTILITY TYPES ===
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// === STATE TYPES ===
export interface LoadingState {
  loading: boolean;
  error?: string | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface FilterState {
  search?: string;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 