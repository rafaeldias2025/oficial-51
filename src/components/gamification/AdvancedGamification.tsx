import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Medal, Crown, Star, Flame, Target, Award, Zap, 
  Heart, Brain, Dumbbell, BookOpen, Calendar, Users, Sparkles, Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  points: number;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isEarned: boolean;
  earnedAt?: string;
}

interface Level {
  level: number;
  currentXP: number;
  maxXP: number;
  title: string;
  rewards: string[];
}

export const AdvancedGamification: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [currentLevel, setCurrentLevel] = useState<Level>({
    level: 1,
    currentXP: 0,
    maxXP: 100,
    title: 'Iniciante',
    rewards: []
  });
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [unlockedItem, setUnlockedItem] = useState<any>(null);
  const { user } = useAuth();

  // Carregar dados de gamificação
  useEffect(() => {
    const loadGamificationData = async () => {
      if (!user?.id) return;

      try {
        // Carregar conquistas
        const { data: achievementsData } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);

        // Carregar badges
        const { data: badgesData } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id);

        // Carregar nível
        const { data: levelData } = await supabase
          .from('user_levels')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Processar dados
        const processedAchievements = getDefaultAchievements().map(achievement => {
          const userAchievement = achievementsData?.find(a => a.achievement_id === achievement.id);
          return {
            ...achievement,
            isUnlocked: !!userAchievement,
            progress: userAchievement?.progress || 0,
            unlockedAt: userAchievement?.unlocked_at
          };
        });

        const processedBadges = getDefaultBadges().map(badge => {
          const userBadge = badgesData?.find(b => b.badge_id === badge.id);
          return {
            ...badge,
            isEarned: !!userBadge,
            earnedAt: userBadge?.earned_at
          };
        });

        setAchievements(processedAchievements);
        setBadges(processedBadges);

        if (levelData) {
          setCurrentLevel({
            level: levelData.level || 1,
            currentXP: levelData.current_xp || 0,
            maxXP: calculateMaxXP(levelData.level || 1),
            title: getLevelTitle(levelData.level || 1),
            rewards: levelData.rewards || []
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados de gamificação:', error);
      }
    };

    loadGamificationData();
  }, [user?.id]);

  const getDefaultAchievements = (): Achievement[] => [
    {
      id: 'first_mission',
      title: 'Primeira Missão',
      description: 'Complete sua primeira missão do dia',
      icon: '🎯',
      category: 'daily',
      points: 50,
      isUnlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'week_streak',
      title: 'Semana Perfeita',
      description: 'Complete missões por 7 dias consecutivos',
      icon: '🔥',
      category: 'weekly',
      points: 200,
      isUnlocked: false,
      progress: 0,
      maxProgress: 7
    },
    {
      id: 'water_champion',
      title: 'Campeão da Água',
      description: 'Beba 2L de água por 5 dias seguidos',
      icon: '💧',
      category: 'weekly',
      points: 150,
      isUnlocked: false,
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'fitness_master',
      title: 'Mestre do Fitness',
      description: 'Complete 30 atividades físicas',
      icon: '💪',
      category: 'monthly',
      points: 500,
      isUnlocked: false,
      progress: 0,
      maxProgress: 30
    },
    {
      id: 'mindfulness_guru',
      title: 'Guru da Mindfulness',
      description: 'Pratique mindfulness por 21 dias',
      icon: '🧘',
      category: 'monthly',
      points: 300,
      isUnlocked: false,
      progress: 0,
      maxProgress: 21
    },
    {
      id: 'community_leader',
      title: 'Líder da Comunidade',
      description: 'Ajude 10 outros usuários',
      icon: '👥',
      category: 'special',
      points: 1000,
      isUnlocked: false,
      progress: 0,
      maxProgress: 10
    }
  ];

  const getDefaultBadges = (): Badge[] => [
    {
      id: 'newcomer',
      name: 'Novato',
      description: 'Primeiro login na plataforma',
      icon: '🌟',
      rarity: 'common',
      isEarned: false
    },
    {
      id: 'dedicated',
      name: 'Dedicado',
      description: '7 dias consecutivos de atividade',
      icon: '🔥',
      rarity: 'rare',
      isEarned: false
    },
    {
      id: 'warrior',
      name: 'Guerreiro',
      description: '30 dias consecutivos de atividade',
      icon: '⚔️',
      rarity: 'epic',
      isEarned: false
    },
    {
      id: 'legend',
      name: 'Lenda',
      description: '100 dias consecutivos de atividade',
      icon: '👑',
      rarity: 'legendary',
      isEarned: false
    },
    {
      id: 'fitness_enthusiast',
      name: 'Entusiasta do Fitness',
      description: 'Complete 50 atividades físicas',
      icon: '💪',
      rarity: 'rare',
      isEarned: false
    },
    {
      id: 'mindfulness_master',
      name: 'Mestre da Mindfulness',
      description: 'Pratique mindfulness por 100 dias',
      icon: '🧘',
      rarity: 'epic',
      isEarned: false
    }
  ];

  const calculateMaxXP = (level: number): number => {
    return level * 100 + (level - 1) * 50;
  };

  const getLevelTitle = (level: number): string => {
    const titles = [
      'Iniciante', 'Aprendiz', 'Dedicado', 'Comprometido', 'Entusiasta',
      'Guerreiro', 'Mestre', 'Especialista', 'Lenda', 'Ícone'
    ];
    return titles[Math.min(level - 1, titles.length - 1)] || 'Lenda';
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return <Calendar className="h-4 w-4" />;
      case 'weekly': return <Target className="h-4 w-4" />;
      case 'monthly': return <Award className="h-4 w-4" />;
      case 'special': return <Crown className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
          unlocked_at: new Date().toISOString()
        });

      if (error) throw error;

      setAchievements(prev => prev.map(a => 
        a.id === achievementId 
          ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
          : a
      ));

      // Mostrar animação de desbloqueio
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        setUnlockedItem(achievement);
        setShowUnlockAnimation(true);
        setTimeout(() => setShowUnlockAnimation(false), 3000);
      }
    } catch (error) {
      console.error('Erro ao desbloquear conquista:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Nível atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Seu Progresso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Nível {currentLevel.level}</h3>
                <p className="text-sm text-muted-foreground">{currentLevel.title}</p>
              </div>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Star className="h-4 w-4 mr-1" />
                {currentLevel.currentXP} / {currentLevel.maxXP} XP
              </Badge>
            </div>
            <Progress 
              value={(currentLevel.currentXP / currentLevel.maxXP) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-blue-500" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.isUnlocked 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(achievement.category)}
                      <span className="text-xs text-muted-foreground">
                        {achievement.points} pontos
                      </span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                      {achievement.isUnlocked && (
                        <Badge className="bg-green-500 text-white text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Conquistado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  badge.isEarned 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 bg-white opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {badge.description}
                  </p>
                  <Badge className={`${getRarityColor(badge.rarity)} text-white text-xs`}>
                    {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                  </Badge>
                  {badge.isEarned && (
                    <div className="mt-2">
                      <Badge className="bg-green-500 text-white text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Conquistado
                      </Badge>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Animação de desbloqueio */}
      <AnimatePresence>
        {showUnlockAnimation && unlockedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white rounded-lg p-8 text-center shadow-2xl"
            >
              <div className="text-6xl mb-4">{unlockedItem.icon}</div>
              <h3 className="text-xl font-bold mb-2">Conquista Desbloqueada!</h3>
              <p className="text-lg mb-4">{unlockedItem.title}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {unlockedItem.description}
              </p>
              <Badge className="bg-green-500 text-white">
                +{unlockedItem.points} pontos
              </Badge>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 