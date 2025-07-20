import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Play, Clock, Users, Star, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumCourseHeroProps {
  course: {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    hero_image_url?: string;
    price: number;
    is_premium: boolean;
    instructor_name?: string;
    duration_hours?: number;
    difficulty_level?: string;
    category?: string;
  };
  onStartCourse: () => void;
  onPreviewCourse: () => void;
}

export const PremiumCourseHero: React.FC<PremiumCourseHeroProps> = ({
  course,
  onStartCourse,
  onPreviewCourse
}) => {
  const heroImage = course.hero_image_url || course.image_url || '/placeholder.svg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-slate-900/95 to-purple-900/90" />
      
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-transparent to-slate-900/80" />
      
      {/* Conteúdo */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Informações do curso */}
          <div className="space-y-6">
            {/* Badge Premium */}
            {course.is_premium && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 px-4 py-2 text-sm font-semibold">
                  <Crown className="h-4 w-4 mr-2" />
                  Curso Premium
                </Badge>
              </motion.div>
            )}
            
            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              {course.title}
            </motion.h1>
            
            {/* Descrição */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-purple-200 leading-relaxed"
            >
              {course.description}
            </motion.p>
            
            {/* Métricas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 text-white/80"
            >
              {course.duration_hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration_hours}h de conteúdo</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>+1.000 alunos</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 avaliações</span>
              </div>
            </motion.div>
            
            {/* Botões de ação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={onStartCourse}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="h-5 w-5 mr-2" />
                Começar Agora
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <Button
                onClick={onPreviewCourse}
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Ver Preview
              </Button>
            </motion.div>
            
            {/* Preço */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4"
            >
              <div className="text-3xl font-bold text-white">
                {course.price > 0 ? `R$ ${course.price.toFixed(2)}` : 'Gratuito'}
              </div>
              {course.price > 0 && (
                <Badge className="bg-green-500 text-white px-3 py-1">
                  Garantia de 30 dias
                </Badge>
              )}
            </motion.div>
          </div>
          
          {/* Imagem do curso */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt={course.title}
                className="w-full h-80 object-cover"
              />
              
              {/* Overlay com play button */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="lg"
                  className="bg-white/90 text-black hover:bg-white font-semibold"
                >
                  <Play className="h-6 w-6 mr-2" />
                  Assistir Trailer
                </Button>
              </div>
            </div>
            
            {/* Informações adicionais */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-white/80 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Instrutor</div>
                <div>{course.instructor_name || 'Michelle Feiteira'}</div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-semibold">Nível</div>
                <div className="capitalize">{course.difficulty_level || 'Intermediário'}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}; 