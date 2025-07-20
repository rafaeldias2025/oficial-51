import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, Award, Star, Users, TrendingUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RankingUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  position: number;
  level: string;
  achievements: number;
  streak: number;
}

const mockUsers: RankingUser[] = [
  {
    id: '1',
    name: 'Maria Silva',
    points: 2840,
    position: 1,
    level: 'Ouro',
    achievements: 12,
    streak: 15
  },
  {
    id: '2',
    name: 'João Santos',
    points: 2650,
    position: 2,
    level: 'Prata',
    achievements: 10,
    streak: 12
  },
  {
    id: '3',
    name: 'Ana Costa',
    points: 2480,
    position: 3,
    level: 'Bronze',
    achievements: 8,
    streak: 8
  },
  {
    id: '4',
    name: 'Pedro Lima',
    points: 2320,
    position: 4,
    level: 'Bronze',
    achievements: 7,
    streak: 6
  },
  {
    id: '5',
    name: 'Carla Ferreira',
    points: 2180,
    position: 5,
    level: 'Bronze',
    achievements: 6,
    streak: 5
  }
];

export default function PublicRanking() {
  const [users, setUsers] = useState<RankingUser[]>(mockUsers);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-netflix-text-muted font-bold text-sm">
          {position}
        </span>;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Ouro':
        return 'bg-yellow-500 text-white';
      case 'Prata':
        return 'bg-gray-400 text-white';
      case 'Bronze':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-netflix-hover text-netflix-text';
    }
  };

  return (
    <div className="min-h-screen bg-netflix-background text-netflix-text">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-netflix-red hover:opacity-90 transition-opacity">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <Trophy className="w-7 h-7 text-netflix-red" />
              <h1 className="text-3xl font-bold">Ranking Público</h1>
            </div>
          </div>
          
          <Button className="bg-netflix-red hover:bg-netflix-red/90">
            <Star className="w-4 h-4 mr-2" />
            Ver Meu Ranking
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-netflix-card border-netflix-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-netflix-text-muted text-sm">Total de Participantes</p>
                  <p className="text-2xl font-bold text-netflix-text">1,247</p>
                </div>
                <Users className="w-8 h-8 text-netflix-red" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-netflix-card border-netflix-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-netflix-text-muted text-sm">Pontos Médios</p>
                  <p className="text-2xl font-bold text-netflix-text">1,850</p>
                </div>
                <TrendingUp className="w-8 h-8 text-netflix-red" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-netflix-card border-netflix-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-netflix-text-muted text-sm">Maior Sequência</p>
                  <p className="text-2xl font-bold text-netflix-text">28 dias</p>
                </div>
                <Award className="w-8 h-8 text-netflix-red" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-netflix-card border-netflix-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-netflix-text-muted text-sm">Conquistas</p>
                  <p className="text-2xl font-bold text-netflix-text">156</p>
                </div>
                <Trophy className="w-8 h-8 text-netflix-red" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('week')}
            className={selectedPeriod === 'week' 
              ? 'bg-netflix-red hover:bg-netflix-red/90'
              : 'border-netflix-border text-netflix-text hover:bg-netflix-hover'
            }
          >
            Esta Semana
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('month')}
            className={selectedPeriod === 'month' 
              ? 'bg-netflix-red hover:bg-netflix-red/90'
              : 'border-netflix-border text-netflix-text hover:bg-netflix-hover'
            }
          >
            Este Mês
          </Button>
          <Button 
            variant={selectedPeriod === 'year' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('year')}
            className={selectedPeriod === 'year' 
              ? 'bg-netflix-red hover:bg-netflix-red/90'
              : 'border-netflix-border text-netflix-text hover:bg-netflix-hover'
            }
          >
            Este Ano
          </Button>
        </div>

        {/* Ranking List */}
        <Card className="bg-netflix-card border-netflix-border">
          <CardHeader>
            <CardTitle className="text-xl text-netflix-text">Top 5 - {selectedPeriod === 'week' ? 'Esta Semana' : selectedPeriod === 'month' ? 'Este Mês' : 'Este Ano'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user, index) => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-netflix-hover hover:bg-netflix-hover/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {getPositionIcon(user.position)}
                      <div className="w-10 h-10 bg-netflix-red rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-netflix-text">{user.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getLevelColor(user.level)}>
                          {user.level}
                        </Badge>
                        <span className="text-sm text-netflix-text-muted">
                          {user.achievements} conquistas
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-netflix-text">{user.points.toLocaleString()}</p>
                    <p className="text-sm text-netflix-text-muted">pontos</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-netflix-red" />
                      <span className="text-sm text-netflix-text-muted">{user.streak} dias</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Button className="w-full bg-netflix-red hover:bg-netflix-red/90">
            <Trophy className="w-4 h-4 mr-2" />
            Participar do Ranking
          </Button>
        </div>
      </div>
    </div>
  );
} 