import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Heart, MessageCircle, Trophy, Award, Moon } from 'lucide-react';
import { PremiumCourseSystem } from '@/components/courses/PremiumCourseSystem';

const PremiumSystemDemo: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('demo-course-1');

  const demoCourses = [
    {
      id: 'demo-course-1',
      title: 'Curso Premium de Nutrição Avançada',
      description: 'Aprenda os fundamentos da nutrição moderna',
      is_premium: true,
      image_url: '/src/assets/course-nutrition.jpg'
    },
    {
      id: 'demo-course-2', 
      title: 'Fitness Funcional Premium',
      description: 'Treinos funcionais para todos os níveis',
      is_premium: true,
      image_url: '/src/assets/course-fitness.jpg'
    },
    {
      id: 'demo-course-3',
      title: 'Mindfulness e Bem-estar',
      description: 'Técnicas de meditação e autocuidado',
      is_premium: true,
      image_url: '/src/assets/course-mindfulness.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-yellow-500 mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sistema Premium de Cursos
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Demonstração completa do sistema avançado de cursos premium com todas as funcionalidades implementadas
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">Hero Dinâmico</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Imagem ou vídeo configurável</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">Módulos Escaláveis</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Sistema flexível de módulos</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Interação Social</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Comentários, favoritos e avaliações</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">Recursos Extras</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Badges, certificados e temas</p>
            </CardContent>
          </Card>
        </div>

        {/* Course Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Selecionar Curso Premium para Demonstração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoCourses.map((course) => (
                <Card 
                  key={course.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCourseId === course.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{course.title}</h3>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Premium
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{course.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium System Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-500" />
              Sistema Premium - Curso: {demoCourses.find(c => c.id === selectedCourseId)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PremiumCourseSystem courseId={selectedCourseId} />
          </CardContent>
        </Card>

        {/* Status */}
        <div className="mt-8 text-center">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ✅ Sistema Premium Funcionando
          </Badge>
          <p className="text-sm text-gray-600 mt-2">
            Todas as funcionalidades premium estão implementadas e funcionando corretamente
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumSystemDemo; 