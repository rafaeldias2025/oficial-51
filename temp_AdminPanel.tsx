import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  FileText, 
  Video, 
  TrendingUp, 
  Users, 
  Settings, 
  BookOpen, 
  Plus, 
  Award,
  Upload,
  Target,
  CheckCircle,
  ClipboardList,
  Calendar
} from 'lucide-react';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { LessonManager } from './LessonManager';
import { ModuleManager } from './ModuleManager';
import { CourseManager } from './CourseManager';
import { JourneyManager } from './JourneyManager';
import { QuizManager } from './QuizManager';
import { AnamneseManager } from './AnamneseManager';
// SessionManager temporariamente desabilitado

type AdminTab = 'dashboard' | 'courses' | 'modules' | 'lessons' | 'journeys' | 'quizzes' | 'anamnese' | 'sessions' | 'analytics' | 'users' | 'settings';

interface AdminStats {
  totalCourses: number;
  totalModules: number;
  totalLessons: number;
  totalUsers: number;
  totalViews: number;
  totalRevenue: number;
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<AdminStats>({
    totalCourses: 12,
    totalModules: 45,
    totalLessons: 180,
    totalUsers: 15420,
    totalViews: 45600,
    totalRevenue: 45600
  });

  const tabs = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: BarChart3,
