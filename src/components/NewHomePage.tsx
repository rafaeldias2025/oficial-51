import React from 'react';
import { motion } from 'framer-motion';
import { UserHeader } from './UserHeader';
import { ActivityCards } from './ActivityCards';
import { QuickActions } from './QuickActions';
import { DynamicContent } from './DynamicContent';
import { useAuth } from '@/hooks/useAuth';

export const NewHomePage: React.FC = () => {
  const { user } = useAuth();

  // Mock user stats - em produção viria do contexto
  const userStats = {
    points: 1250,
    level: "Iniciante",
    rank: 15,
    goalsCompleted: 3,
    totalGoals: 5,
    goalsProgress: 75,
    healthScore: 85,
    coursesInProgress: 2,
    activeChallenges: 3,
    workoutsToday: 1
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* User Header */}
      <UserHeader user={user} userStats={userStats} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo de volta, {user?.email?.split('@')[0] || 'Usuário'}! 👋
            </h1>
            <p className="text-muted-foreground">
              Continue sua jornada de transformação hoje
            </p>
          </div>
        </motion.div>

        {/* Activity Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Suas Atividades</h2>
            <ActivityCards userStats={userStats} />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <QuickActions />
        </motion.div>

        {/* Dynamic Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <DynamicContent />
        </motion.div>

        {/* Bottom Spacing */}
        <div className="h-20" />
      </div>
    </div>
  );
}; 