export interface ResponseData {
  id: string;
  questionId: string;
  questionText: string;
  responseValue: number;
  responseText: string;
  category: string;
  categoryScore: number;
  questionNumber: number;
}

export interface CategoryScore {
  category: string;
  score: number;
  totalQuestions: number;
  averageScore: number;
}

export interface TrendData {
  category: string;
  currentScore: number;
  previousScore: number;
  change: number;
  trend: 'improvement' | 'decline' | 'stable';
}

export interface SessionAnalysis {
  overallScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  trends: TrendData[];
  insights: InsightData[];
}

export interface InsightData {
  type: 'strength' | 'weakness' | 'trend' | 'pattern';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category?: string;
  data?: any;
}

export interface SessionFeedback {
  id: string;
  sessionId: string;
  userId: string;
  responses: ResponseData[];
  analysis: SessionAnalysis;
  metadata: SessionMetadata;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionMetadata {
  sessionType: string;
  duration: string;
  completionRate: number;
  toolId?: string;
  toolName?: string;
  totalQuestions: number;
  completedQuestions: number;
}

export interface FeedbackChartData {
  category: string;
  score: number;
  color: string;
  percentage: number;
}

export interface FeedbackSummary {
  totalSessions: number;
  averageScore: number;
  bestCategory: string;
  needsAttention: string;
  improvementAreas: string[];
  strengths: string[];
}

export interface FeedbackRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  actionItems: string[];
  resources?: string[];
}

export interface FeedbackInsight {
  id: string;
  type: 'pattern' | 'trend' | 'strength' | 'weakness';
  title: string;
  description: string;
  data: any;
  confidence: number;
  actionable: boolean;
}

// Enums para tipos específicos
export enum InsightType {
  STRENGTH = 'strength',
  WEAKNESS = 'weakness',
  TREND = 'trend',
  PATTERN = 'pattern'
}

export enum TrendDirection {
  IMPROVEMENT = 'improvement',
  DECLINE = 'decline',
  STABLE = 'stable'
}

export enum PriorityLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum ImpactLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// Tipos para componentes
export interface FeedbackChartProps {
  data: FeedbackChartData[];
  title: string;
  height?: number;
  showPercentage?: boolean;
}

export interface FeedbackInsightsProps {
  insights: FeedbackInsight[];
  onInsightClick?: (insight: FeedbackInsight) => void;
}

export interface FeedbackRecommendationsProps {
  recommendations: FeedbackRecommendation[];
  onRecommendationClick?: (recommendation: FeedbackRecommendation) => void;
}

export interface SessionFeedbackProps {
  sessionId: string;
  userId: string;
  onComplete?: (feedback: SessionFeedback) => void;
  onClose?: () => void;
}

// Tipos para hooks
export interface UseSessionFeedbackReturn {
  feedback: SessionFeedback | null;
  loading: boolean;
  error: string | null;
  generateFeedback: (responses: ResponseData[]) => Promise<SessionFeedback>;
  saveFeedback: (feedback: SessionFeedback) => Promise<void>;
  loadFeedback: (sessionId: string) => Promise<SessionFeedback | null>;
  updateFeedback: (feedback: SessionFeedback) => Promise<void>;
}

export interface UseFeedbackAnalysisReturn {
  analyzeResponses: (responses: ResponseData[]) => SessionAnalysis;
  generateInsights: (analysis: SessionAnalysis) => FeedbackInsight[];
  generateRecommendations: (analysis: SessionAnalysis) => FeedbackRecommendation[];
  calculateTrends: (currentSession: SessionFeedback, previousSessions: SessionFeedback[]) => TrendData[];
} 