import React from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  FileText, 
  Target, 
  BarChart3, 
  Stethoscope, 
  MessageCircle,
  Plus,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'weighing',
      title: 'Nova Pesagem',
      description: 'Registre seu peso atual',
      icon: Scale,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/weighing'),
      badge: 'Hoje'
    },
    {
      id: 'diary',
      title: 'Diário de Saúde',
      description: 'Anote suas observações',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/diary'),
      badge: '2 entradas'
    },
    {
      id: 'goals',
      title: 'Definir Meta',
      description: 'Crie uma nova meta',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/goals/new'),
      badge: 'Nova'
    },
    {
      id: 'reports',
      title: 'Relatórios',
      description: 'Visualize seus dados',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/reports'),
      badge: 'Atualizado'
    },
    {
      id: 'consultation',
      title: 'Consulta Virtual',
      description: 'Agende uma consulta',
      icon: Stethoscope,
      color: 'from-indigo-500 to-blue-500',
      action: () => navigate('/consultation'),
      badge: 'Disponível'
    },
    {
      id: 'support',
      title: 'Suporte',
      description: 'Fale conosco',
      icon: MessageCircle,
      color: 'from-yellow-500 to-orange-500',
      action: () => navigate('/support'),
      badge: 'Online'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ações Rápidas</h2>
          <p className="text-muted-foreground">Acesse as funcionalidades principais</p>
        </div>
        <Button variant="outline" size="sm">
          <Zap className="w-4 h-4 mr-2" />
          Personalizar
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50"
              onClick={action.action}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  {action.title}
                </h3>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {action.description}
                </p>
                
                <Badge variant="secondary" className="text-xs">
                  {action.badge}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 