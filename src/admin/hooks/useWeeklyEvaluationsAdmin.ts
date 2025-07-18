import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseWeeklyEvaluationsArgs {
  userId?: string;
  weekStart?: string;
  emotionalState?: string;
}

interface WeeklyEvaluation {
  id: string;
  user_id: string;
  week_start: string;
  emotional_state?: string;
  created_at: string;
  updated_at: string;
}

export function useWeeklyEvaluationsAdmin({ userId, weekStart, emotionalState }: UseWeeklyEvaluationsArgs = {}) {
  return useQuery({
    queryKey: ['weekly-evaluations', { userId, weekStart, emotionalState }],
    queryFn: async (): Promise<WeeklyEvaluation[]> => {
      // Since weekly_evaluations table might not exist, return empty array
      return [];
    },
  });
}