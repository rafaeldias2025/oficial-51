import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Trophy, 
  Calendar, 
  Users, 
  Heart,
  Star,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const DynamicContent: React.FC = () => {
  const tips = [
    {
      id: 1,
      title: "Dica do Dia",
      content: "Beba água antes das refeições para aumentar a saciedade e reduzir a ingestão calórica.",
      icon: Lightbulb,
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "Motivação",
      content: "Cada passo conta! Pequenas mudanças levam a grandes resultados.",
      icon: Heart,
      color: "from-red-400 to-pink-500"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Primeira Semana",
      description: "Completou 7 dias consecutivos",
      icon: Trophy,
      color: "from-yellow-400 to-orange-500",
      date: "Hoje"
    },
    {
      id: 2,
      title: "Meta Alcançada",
      description: "Atingiu sua primeira meta de peso",
      icon: Star,
      color: "from-blue-400 to-cyan-500",
      date: "Ontem"
    }
  ];

  const communityPosts = [
    {
      id: 1,
      user: "Ana Silva",
      avatar: "AS",
      content: "Consegui perder 2kg esta semana! 🎉",
      likes: 12,
      time: "2h atrás"
    },
    {
      id: 2,
      user: "Carlos Mendes",
      avatar: "CM",
      content: "Dica: caminhar 30min por dia faz toda diferença!",
      likes: 8,
      time: "4h atrás"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Dicas e Motivação */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Dicas e Motivação</h3>
        
        {tips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${tip.color}`}>
                    <tip.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">{tip.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{tip.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Conquistas e Comunidade */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Conquistas Recentes</h3>
        
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${achievement.color}`}>
                      <achievement.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {achievement.date}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comunidade */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">Comunidade</h3>
            <Button variant="ghost" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ver Mais
            </Button>
          </div>
          
          <div className="space-y-4">
            {communityPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{post.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">{post.user}</span>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Heart className="w-3 h-3 mr-1" />
                            {post.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 