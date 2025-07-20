import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CategoryScoreCardProps {
  category: string;
  score: number;
  color: string;
  maxScore: number;
}

export const CategoryScoreCard: React.FC<CategoryScoreCardProps> = ({
  category,
  score,
  color,
  maxScore = 10
}) => {
  // Calcular porcentagem da pontuação
  const percentage = Math.round((score / maxScore) * 100);
  
  // Determinar classe de cor baseada na pontuação
  const getScoreClass = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-emerald-500';
    if (percentage >= 40) return 'text-yellow-500';
    if (percentage >= 20) return 'text-orange-500';
    return 'text-red-500';
  };
  
  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: color }}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{category}</h3>
          <span className={`text-2xl font-bold ${getScoreClass()}`}>
            {score.toFixed(1)}
          </span>
        </div>
        
        <Progress 
          value={percentage} 
          className="h-2"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.1)',
            '--progress-background': color
          } as React.CSSProperties}
        />
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">0</span>
          <span className="text-xs text-muted-foreground">{maxScore}</span>
        </div>
      </CardContent>
    </Card>
  );
}; 