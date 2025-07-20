// Tipos para o Sistema de Sessões e Ferramentas

export interface CoachingTool {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedTime: number; // em minutos
  isActive: boolean;
  questions: ToolQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolQuestion {
  id: string;
  toolId: string;
  questionText: string;
  questionType: 'scale' | 'multiple_choice' | 'text' | 'yes_no';
  category: string;
  order: number;
  options?: string[]; // para múltipla escolha
  scaleRange?: { min: number; max: number; step: number };
  isRequired: boolean;
}

export interface CoachingSession {
  id: string;
  userId: string;
  adminId?: string;
  toolId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  startedAt?: Date;
  completedAt?: Date;
  responses: SessionResponse[];
  results?: SessionResults;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionResponse {
  id: string;
  sessionId: string;
  questionId: string;
  responseValue: number | string | string[];
  responseText?: string;
  category: string;
  timestamp: Date;
}

export interface SessionResults {
  id: string;
  sessionId: string;
  overallScore: number;
  categoryScores: CategoryScore[];
  insights: SessionInsight[];
  recommendations: string[];
  radarData: RadarDataPoint[];
  barChartData: BarChartDataPoint[];
  gaugeValue: number;
  createdAt: Date;
}

export interface CategoryScore {
  category: string;
  score: number;
  totalQuestions: number;
  averageScore: number;
  color: string;
}

export interface SessionInsight {
  id: string;
  type: 'strength' | 'weakness' | 'trend' | 'pattern';
  title: string;
  description: string;
  category?: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export interface RadarDataPoint {
  category: string;
  value: number;
  color: string;
}

export interface BarChartDataPoint {
  category: string;
  value: number;
  color: string;
  percentage: number;
}

export interface UserSession {
  id: string;
  userId: string;
  toolName: string;
  toolDescription: string;
  scheduledDate: Date;
  status: 'pending' | 'available' | 'in_progress' | 'completed';
  estimatedTime: number;
  progress: number; // 0-100
  canStart: boolean;
}

export interface AdminDashboard {
  totalTools: number;
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  recentSessions: CoachingSession[];
  upcomingSessions: CoachingSession[];
  toolStats: ToolStats[];
}

export interface ToolStats {
  toolId: string;
  toolName: string;
  totalSessions: number;
  averageScore: number;
  completionRate: number;
}

export interface SessionFilters {
  dateRange?: { start: Date; end: Date };
  status?: string[];
  toolId?: string;
  userId?: string;
  scoreRange?: { min: number; max: number };
}

// Enums
export enum SessionStatus {
  PENDING = 'pending',
  AVAILABLE = 'available',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum QuestionType {
  SCALE = 'scale',
  MULTIPLE_CHOICE = 'multiple_choice',
  TEXT = 'text',
  YES_NO = 'yes_no'
}

export enum InsightType {
  STRENGTH = 'strength',
  WEAKNESS = 'weakness',
  TREND = 'trend',
  PATTERN = 'pattern'
}

export enum ImpactLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Tipos para componentes
export interface ToolManagementProps {
  tools: CoachingTool[];
  onToolCreate: (tool: Partial<CoachingTool>) => void;
  onToolUpdate: (id: string, tool: Partial<CoachingTool>) => void;
  onToolDelete: (id: string) => void;
}

export interface SessionSchedulingProps {
  users: any[]; // User type from auth
  tools: CoachingTool[];
  onScheduleSession: (session: Partial<CoachingSession>) => void;
}

export interface SessionPlayerProps {
  session: CoachingSession;
  tool: CoachingTool;
  onResponse: (response: SessionResponse) => void;
  onComplete: (results: SessionResults) => void;
}

export interface ResultsDashboardProps {
  sessions: CoachingSession[];
  filters: SessionFilters;
  onFilterChange: (filters: SessionFilters) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

// Tipos para hooks
export interface UseToolManagementReturn {
  tools: CoachingTool[];
  loading: boolean;
  error: string | null;
  createTool: (tool: Partial<CoachingTool>) => Promise<void>;
  updateTool: (id: string, tool: Partial<CoachingTool>) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  getTool: (id: string) => CoachingTool | null;
}

export interface UseSessionManagementReturn {
  sessions: CoachingSession[];
  loading: boolean;
  error: string | null;
  scheduleSession: (session: Partial<CoachingSession>) => Promise<void>;
  updateSession: (id: string, session: Partial<CoachingSession>) => Promise<void>;
  getSession: (id: string) => CoachingSession | null;
  getUserSessions: (userId: string) => CoachingSession[];
}

export interface UseSessionPlayerReturn {
  currentQuestion: ToolQuestion | null;
  progress: number;
  responses: SessionResponse[];
  loading: boolean;
  error: string | null;
  submitResponse: (response: SessionResponse) => Promise<void>;
  saveProgress: () => Promise<void>;
  completeSession: () => Promise<SessionResults>;
} 