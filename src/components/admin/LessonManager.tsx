import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Play, Clock, Users, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UploadThumbnail } from './UploadThumbnail';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Lesson {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleId: string;
  thumbnail: string;
  videoUrl: string;
  duration: number; // em segundos
  order: number;
  isActive: boolean;
  isPremium: boolean;
  totalViews: number;
  completionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

interface LessonFormData {
  title: string;
  description: string;
  courseId: string;
  moduleId: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  isActive: boolean;
  isPremium: boolean;
}

interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  courseId: string;
}

export const LessonManager: React.FC = () => {
  // Dados mockados para demonstração
  const [courses] = useState<Course[]>([
    { id: '1', title: '7 CHAVES' },
    { id: '2', title: '12 CHÁS' },
    { id: '3', title: 'PÍLULAS DO BEM' },
    { id: '4', title: 'Jejum Intermitente' },
    { id: '5', title: 'Dia a Dia' },
    { id: '6', title: 'Doces dos Sonhos' },
    { id: '7', title: 'Exercícios dos Sonhos' }
  ]);

  const [modules] = useState<Module[]>([
    // 7 CHAVES
    { id: '1', title: 'Módulo 1: Fundamentos', courseId: '1' },
    
    // 12 CHÁS
    { id: '2', title: 'Chás Básicos', courseId: '2' },
    
    // PÍLULAS DO BEM
    { id: '3', title: 'Suplementos Essenciais', courseId: '3' },
    
    // Jejum Intermitente
    { id: '4', title: 'Fundamentos do Jejum', courseId: '4' },
    
    // Dia a Dia
    { id: '5', title: 'Rotinas Diárias', courseId: '5' },
    
    // Doces dos Sonhos
    { id: '6', title: 'Doces Básicos', courseId: '6' },
    { id: '7', title: 'Doces Avançados', courseId: '6' },
    { id: '8', title: 'Receitas para Diabéticos', courseId: '6' },
    
    // Exercícios dos Sonhos
    { id: '9', title: 'Membros Superiores', courseId: '7' },
    { id: '10', title: 'Treino para Gestantes', courseId: '7' },
    { id: '11', title: 'Pernas Definidas', courseId: '7' },
    { id: '12', title: 'Treino de Mobilidade', courseId: '7' },
    { id: '13', title: 'Bum Bum na Nuca', courseId: '7' }
  ]);

  const [lessons, setLessons] = useState<Lesson[]>([
    // 7 CHAVES - Módulo 1: Fundamentos
    {
      id: '1',
      title: 'CHAVE 01 (PACIÊNCIA)',
      description: 'Aprenda a desenvolver a paciência como primeira chave para o sucesso',
      courseId: '1',
      moduleId: '1',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video1.mp4',
      duration: 1800, // 30 minutos
      order: 1,
      isActive: true,
      isPremium: false,
      totalViews: 1250,
      completionRate: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'CHAVE 02 (IMAGINAÇÃO)',
      description: 'Desenvolva sua imaginação criativa para alcançar seus objetivos',
      courseId: '1',
      moduleId: '1',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video2.mp4',
      duration: 1500, // 25 minutos
      order: 2,
      isActive: true,
      isPremium: false,
      totalViews: 1100,
      completionRate: 88,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'CHAVE 03 (ADAPTAÇÃO)',
      description: 'Aprenda a se adaptar às mudanças e desafios da vida',
      courseId: '1',
      moduleId: '1',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video3.mp4',
      duration: 1600, // 27 minutos
      order: 3,
      isActive: true,
      isPremium: false,
      totalViews: 980,
      completionRate: 82,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      title: 'CHAVE 04 (HABITO)',
      description: 'Como criar e manter hábitos positivos para o sucesso',
      courseId: '1',
      moduleId: '1',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video4.mp4',
      duration: 2000, // 33 minutos
      order: 4,
      isActive: true,
      isPremium: false,
      totalViews: 1200,
      completionRate: 90,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      title: 'CHAVE 05 (I.E)',
      description: 'Inteligência Emocional: chave para relacionamentos saudáveis',
      courseId: '1',
      moduleId: '1',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video5.mp4',
      duration: 1700, // 28 minutos
      order: 5,
      isActive: true,
      isPremium: false,
      totalViews: 1050,
      completionRate: 87,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      title: 'CHAVE 06 (VITIMISMO)',
      description: 'Como superar o vitimismo e assumir responsabilidade pela sua vida',
      courseId: '1',
      moduleId: '1',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video6.mp4',
      duration: 1900, // 32 minutos
      order: 6,
      isActive: true,
      isPremium: false,
      totalViews: 950,
      completionRate: 84,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '7',
      title: 'CHAVE 07 (LIBERDADE)',
      description: 'Alcançando a verdadeira liberdade através do autoconhecimento',
      courseId: '1',
      moduleId: '1',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video7.mp4',
      duration: 2100, // 35 minutos
      order: 7,
      isActive: true,
      isPremium: false,
      totalViews: 1300,
      completionRate: 92,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // 12 CHÁS - Módulo 1: Chás Básicos
    {
      id: '8',
      title: 'CHÁ DE ALECRIM',
      description: 'Benefícios e preparo do chá de alecrim para memória e concentração',
      courseId: '2',
      moduleId: '2',
      thumbnail: '/src/assets/course-nutrition.jpg',
      videoUrl: 'https://example.com/video8.mp4',
      duration: 1200, // 20 minutos
      order: 1,
      isActive: true,
      isPremium: true,
      totalViews: 890,
      completionRate: 92,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '9',
      title: 'CHÁ DE CANELA',
      description: 'Como preparar chá de canela para controle glicêmico',
      courseId: '2',
      moduleId: '2',
      thumbnail: '/src/assets/course-nutrition.jpg',
      videoUrl: 'https://example.com/video9.mp4',
      duration: 1100, // 18 minutos
      order: 2,
      isActive: true,
      isPremium: true,
      totalViews: 750,
      completionRate: 88,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '10',
      title: 'CHÁ DE GENGIBRE',
      description: 'Chá de gengibre para digestão e imunidade',
      courseId: '2',
      moduleId: '2',
      thumbnail: '/src/assets/course-nutrition.jpg',
      videoUrl: 'https://example.com/video10.mp4',
      duration: 1300, // 22 minutos
      order: 3,
      isActive: true,
      isPremium: true,
      totalViews: 820,
      completionRate: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '11',
      title: 'CHÁ DE HIBISCO',
      description: 'Chá de hibisco para controle da pressão arterial',
      courseId: '2',
      moduleId: '2',
      thumbnail: '/src/assets/course-nutrition.jpg',
      videoUrl: 'https://example.com/video11.mp4',
      duration: 1000, // 17 minutos
      order: 4,
      isActive: true,
      isPremium: true,
      totalViews: 680,
      completionRate: 90,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '12',
      title: 'CHÁ PRETO',
      description: 'Benefícios e preparo do chá preto tradicional',
      courseId: '2',
      moduleId: '2',
      thumbnail: '/src/assets/course-nutrition.jpg',
      videoUrl: 'https://example.com/video12.mp4',
      duration: 900, // 15 minutos
      order: 5,
      isActive: true,
      isPremium: true,
      totalViews: 720,
      completionRate: 87,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '13',
      title: 'CHÁ VERDE',
      description: 'Chá verde para emagrecimento e antioxidantes',
      courseId: '2',
      moduleId: '2',
      thumbnail: '/src/assets/course-nutrition.jpg',
      videoUrl: 'https://example.com/video13.mp4',
      duration: 1400, // 23 minutos
      order: 6,
      isActive: true,
      isPremium: true,
      totalViews: 950,
      completionRate: 93,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '14',
      title: 'CHÁ VERMELHO',
      description: 'Chá vermelho para detox e bem-estar',
      courseId: '2',
      moduleId: '2',
      thumbnail: '/src/assets/course-nutrition.jpg',
      videoUrl: 'https://example.com/video14.mp4',
      duration: 1150, // 19 minutos
      order: 7,
      isActive: true,
      isPremium: true,
      totalViews: 650,
      completionRate: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '15',
      title: 'CHÁ DE ESPINHEIRA SANTA',
      description: 'Chá de espinheira santa para problemas digestivos',
      courseId: '2',
      moduleId: '2',
      thumbnail: '/src/assets/course-nutrition.jpg',
      videoUrl: 'https://example.com/video15.mp4',
      duration: 1250, // 21 minutos
      order: 8,
      isActive: true,
      isPremium: true,
      totalViews: 580,
      completionRate: 86,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '16',
      title: 'CHÁ DE ORA-PRO-NÓBIS',
      description: 'Chá de ora-pro-nóbis para nutrição e saúde',
      courseId: '2',
      moduleId: '2',
      thumbnail: '/src/assets/course-nutrition.jpg',
      videoUrl: 'https://example.com/video16.mp4',
      duration: 1350, // 23 minutos
      order: 9,
      isActive: true,
      isPremium: true,
      totalViews: 520,
      completionRate: 91,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Jejum Intermitente
    {
      id: '17',
      title: 'JEJUM INTERMITENTE',
      description: 'Guia completo sobre jejum intermitente para saúde e emagrecimento',
      courseId: '4',
      moduleId: '4',
      thumbnail: '/src/assets/course-wellness.jpg',
      videoUrl: 'https://example.com/video17.mp4',
      duration: 2400, // 40 minutos
      order: 1,
      isActive: true,
      isPremium: true,
      totalViews: 1200,
      completionRate: 78,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Doces dos Sonhos - Módulo 1: Doces Básicos
    {
      id: '18',
      title: 'aula 1',
      description: 'Introdução aos doces básicos e técnicas fundamentais',
      courseId: '6',
      moduleId: '6',
      thumbnail: '/src/assets/course-wellness.jpg',
      videoUrl: 'https://example.com/video18.mp4',
      duration: 1800, // 30 minutos
      order: 1,
      isActive: true,
      isPremium: false,
      totalViews: 450,
      completionRate: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '19',
      title: 'BRIGADEIRO DE BANANA',
      description: 'Receita completa do brigadeiro de banana saudável',
      courseId: '6',
      moduleId: '6',
      thumbnail: '/src/assets/course-wellness.jpg',
      videoUrl: 'https://example.com/video19.mp4',
      duration: 1500, // 25 minutos
      order: 2,
      isActive: true,
      isPremium: false,
      totalViews: 380,
      completionRate: 92,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '20',
      title: 'COOKIES DOS SONHOS',
      description: 'Como fazer cookies deliciosos e nutritivos',
      courseId: '6',
      moduleId: '6',
      thumbnail: '/src/assets/course-wellness.jpg',
      videoUrl: 'https://example.com/video20.mp4',
      duration: 1600, // 27 minutos
      order: 3,
      isActive: true,
      isPremium: false,
      totalViews: 420,
      completionRate: 88,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Doces dos Sonhos - Módulo 2: Doces Avançados
    {
      id: '21',
      title: 'aula 1',
      description: 'Técnicas avançadas de confeitaria',
      courseId: '6',
      moduleId: '7',
      thumbnail: '/src/assets/course-wellness.jpg',
      videoUrl: 'https://example.com/video21.mp4',
      duration: 2000, // 33 minutos
      order: 1,
      isActive: true,
      isPremium: true,
      totalViews: 320,
      completionRate: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '22',
      title: 'BOLO DE BANANA',
      description: 'Receita de bolo de banana integral e saudável',
      courseId: '6',
      moduleId: '7',
      thumbnail: '/src/assets/course-wellness.jpg',
      videoUrl: 'https://example.com/video22.mp4',
      duration: 1700, // 28 minutos
      order: 2,
      isActive: true,
      isPremium: true,
      totalViews: 280,
      completionRate: 90,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '23',
      title: 'PANQUECA DOS SONHOS',
      description: 'Panquecas nutritivas e deliciosas',
      courseId: '6',
      moduleId: '7',
      thumbnail: '/src/assets/course-wellness.jpg',
      videoUrl: 'https://example.com/video23.mp4',
      duration: 1400, // 23 minutos
      order: 3,
      isActive: true,
      isPremium: true,
      totalViews: 350,
      completionRate: 87,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Doces dos Sonhos - Módulo 3: Receitas para Diabéticos
    {
      id: '24',
      title: 'Bolo de Baunilha',
      description: 'Bolo de baunilha sem açúcar para diabéticos',
      courseId: '6',
      moduleId: '8',
      thumbnail: '/src/assets/course-wellness.jpg',
      videoUrl: 'https://example.com/video24.mp4',
      duration: 1900, // 32 minutos
      order: 1,
      isActive: true,
      isPremium: true,
      totalViews: 220,
      completionRate: 94,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '25',
      title: 'Queijadinha',
      description: 'Queijadinha sem açúcar para diabéticos',
      courseId: '6',
      moduleId: '8',
      thumbnail: '/src/assets/course-wellness.jpg',
      videoUrl: 'https://example.com/video25.mp4',
      duration: 1600, // 27 minutos
      order: 2,
      isActive: true,
      isPremium: true,
      totalViews: 180,
      completionRate: 91,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '26',
      title: 'Quindim',
      description: 'Quindim sem açúcar para diabéticos',
      courseId: '6',
      moduleId: '8',
      thumbnail: '/src/assets/course-wellness.jpg',
      videoUrl: 'https://example.com/video26.mp4',
      duration: 1500, // 25 minutos
      order: 3,
      isActive: true,
      isPremium: true,
      totalViews: 150,
      completionRate: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Exercícios dos Sonhos - Módulo 1: Membros Superiores
    {
      id: '27',
      title: 'Aula de Membros Superiores',
      description: 'Treino completo para membros superiores',
      courseId: '7',
      moduleId: '9',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video27.mp4',
      duration: 2400, // 40 minutos
      order: 1,
      isActive: true,
      isPremium: false,
      totalViews: 850,
      completionRate: 82,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Exercícios dos Sonhos - Módulo 2: Treino para Gestantes
    {
      id: '28',
      title: 'Boas Vindas',
      description: 'Introdução ao treino para gestantes',
      courseId: '7',
      moduleId: '10',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video28.mp4',
      duration: 900, // 15 minutos
      order: 1,
      isActive: true,
      isPremium: true,
      totalViews: 650,
      completionRate: 95,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '29',
      title: 'Aliviando a Tensão da Lombar',
      description: 'Exercícios para aliviar tensão lombar na gestação',
      courseId: '7',
      moduleId: '10',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video29.mp4',
      duration: 1200, // 20 minutos
      order: 2,
      isActive: true,
      isPremium: true,
      totalViews: 580,
      completionRate: 88,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '30',
      title: 'Agachamento',
      description: 'Agachamento seguro para gestantes',
      courseId: '7',
      moduleId: '10',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video30.mp4',
      duration: 1000, // 17 minutos
      order: 3,
      isActive: true,
      isPremium: true,
      totalViews: 520,
      completionRate: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '31',
      title: 'Aliviando a Tensão da Lombar 2',
      description: 'Mais exercícios para lombar na gestação',
      courseId: '7',
      moduleId: '10',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video31.mp4',
      duration: 1100, // 18 minutos
      order: 4,
      isActive: true,
      isPremium: true,
      totalViews: 480,
      completionRate: 87,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '32',
      title: 'Membros Superiores 1',
      description: 'Treino de membros superiores para gestantes',
      courseId: '7',
      moduleId: '10',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video32.mp4',
      duration: 1300, // 22 minutos
      order: 5,
      isActive: true,
      isPremium: true,
      totalViews: 420,
      completionRate: 83,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '33',
      title: 'Membros Superiores 2',
      description: 'Segunda parte do treino de membros superiores',
      courseId: '7',
      moduleId: '10',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video33.mp4',
      duration: 1400, // 23 minutos
      order: 6,
      isActive: true,
      isPremium: true,
      totalViews: 380,
      completionRate: 80,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '34',
      title: 'Membros Inferiores',
      description: 'Treino de membros inferiores para gestantes',
      courseId: '7',
      moduleId: '10',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video34.mp4',
      duration: 1500, // 25 minutos
      order: 7,
      isActive: true,
      isPremium: true,
      totalViews: 350,
      completionRate: 78,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '35',
      title: 'Relaxamento da lombar',
      description: 'Técnicas de relaxamento para lombar',
      courseId: '7',
      moduleId: '10',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video35.mp4',
      duration: 800, // 13 minutos
      order: 8,
      isActive: true,
      isPremium: true,
      totalViews: 320,
      completionRate: 92,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Exercícios dos Sonhos - Módulo 3: Pernas Definidas
    {
      id: '36',
      title: 'Boas Vindas',
      description: 'Introdução ao treino de pernas definidas',
      courseId: '7',
      moduleId: '11',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video36.mp4',
      duration: 600, // 10 minutos
      order: 1,
      isActive: true,
      isPremium: true,
      totalViews: 750,
      completionRate: 95,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '37',
      title: 'Quadricipes Cadeira',
      description: 'Exercício de quadríceps na cadeira extensora',
      courseId: '7',
      moduleId: '11',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video37.mp4',
      duration: 1200, // 20 minutos
      order: 2,
      isActive: true,
      isPremium: true,
      totalViews: 680,
      completionRate: 88,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '38',
      title: 'Quadriceps Leg-Press',
      description: 'Leg press para desenvolvimento dos quadríceps',
      courseId: '7',
      moduleId: '11',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video38.mp4',
      duration: 1400, // 23 minutos
      order: 3,
      isActive: true,
      isPremium: true,
      totalViews: 620,
      completionRate: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '39',
      title: '03 Quadricips maquina Rack',
      description: 'Exercício de quadríceps na máquina rack',
      courseId: '7',
      moduleId: '11',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video39.mp4',
      duration: 1300, // 22 minutos
      order: 4,
      isActive: true,
      isPremium: true,
      totalViews: 580,
      completionRate: 82,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '40',
      title: '04Posterior de Coxa.mp4',
      description: 'Treino de posterior de coxa',
      courseId: '7',
      moduleId: '11',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video40.mp4',
      duration: 1500, // 25 minutos
      order: 5,
      isActive: true,
      isPremium: true,
      totalViews: 520,
      completionRate: 80,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '41',
      title: 'Passada',
      description: 'Exercício de passada para pernas',
      courseId: '7',
      moduleId: '11',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video41.mp4',
      duration: 1100, // 18 minutos
      order: 6,
      isActive: true,
      isPremium: true,
      totalViews: 480,
      completionRate: 87,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '42',
      title: 'Posterior de coxa cadeira flexora',
      description: 'Cadeira flexora para posterior de coxa',
      courseId: '7',
      moduleId: '11',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video42.mp4',
      duration: 1200, // 20 minutos
      order: 7,
      isActive: true,
      isPremium: true,
      totalViews: 450,
      completionRate: 84,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '43',
      title: 'PANTURILHA EM PÉ',
      description: 'Exercício de panturrilha em pé',
      courseId: '7',
      moduleId: '11',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video43.mp4',
      duration: 900, // 15 minutos
      order: 8,
      isActive: true,
      isPremium: true,
      totalViews: 420,
      completionRate: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '44',
      title: 'coxa interna máquina adução',
      description: 'Máquina de adução para coxa interna',
      courseId: '7',
      moduleId: '11',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video44.mp4',
      duration: 1000, // 17 minutos
      order: 9,
      isActive: true,
      isPremium: true,
      totalViews: 380,
      completionRate: 86,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '45',
      title: 'perna como um todo levantamento terra',
      description: 'Levantamento terra para pernas completas',
      courseId: '7',
      moduleId: '11',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video45.mp4',
      duration: 1800, // 30 minutos
      order: 10,
      isActive: true,
      isPremium: true,
      totalViews: 350,
      completionRate: 78,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Exercícios dos Sonhos - Módulo 4: Treino de Mobilidade
    {
      id: '46',
      title: 'Alongamento Posterior de Coxa',
      description: 'Alongamento completo do posterior de coxa',
      courseId: '7',
      moduleId: '12',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video46.mp4',
      duration: 800, // 13 minutos
      order: 1,
      isActive: true,
      isPremium: false,
      totalViews: 650,
      completionRate: 92,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '47',
      title: 'Alongamento Interno de Coxa',
      description: 'Alongamento da parte interna da coxa',
      courseId: '7',
      moduleId: '12',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video47.mp4',
      duration: 700, // 12 minutos
      order: 2,
      isActive: true,
      isPremium: false,
      totalViews: 580,
      completionRate: 88,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '48',
      title: 'Alongamento Glúteo e Quadril',
      description: 'Alongamento de glúteos e quadril',
      courseId: '7',
      moduleId: '12',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video48.mp4',
      duration: 900, // 15 minutos
      order: 3,
      isActive: true,
      isPremium: false,
      totalViews: 520,
      completionRate: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '49',
      title: 'Alongamento de Quadril',
      description: 'Alongamento específico do quadril',
      courseId: '7',
      moduleId: '12',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video49.mp4',
      duration: 750, // 13 minutos
      order: 4,
      isActive: true,
      isPremium: false,
      totalViews: 480,
      completionRate: 87,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '50',
      title: 'Alongamento Lateral de Quadril',
      description: 'Alongamento lateral do quadril',
      courseId: '7',
      moduleId: '12',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video50.mp4',
      duration: 600, // 10 minutos
      order: 5,
      isActive: true,
      isPremium: false,
      totalViews: 420,
      completionRate: 90,
      createdAt: new Date(),
      updatedAt: new Date()
    },

    // Exercícios dos Sonhos - Módulo 5: Bum Bum na Nuca
    {
      id: '51',
      title: 'BOAS VINDAS',
      description: 'Introdução ao treino de glúteos',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video51.mp4',
      duration: 600, // 10 minutos
      order: 1,
      isActive: true,
      isPremium: true,
      totalViews: 850,
      completionRate: 95,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '52',
      title: 'AQUECIMENTO',
      description: 'Aquecimento específico para glúteos',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video52.mp4',
      duration: 900, // 15 minutos
      order: 2,
      isActive: true,
      isPremium: true,
      totalViews: 780,
      completionRate: 92,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '53',
      title: 'ELEVAÇÃO PELVICA COM BARRA',
      description: 'Elevação pélvica com barra para glúteos',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video53.mp4',
      duration: 1200, // 20 minutos
      order: 3,
      isActive: true,
      isPremium: true,
      totalViews: 720,
      completionRate: 88,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '54',
      title: 'EXERCÍCIO PONTE',
      description: 'Exercício ponte para glúteos',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video54.mp4',
      duration: 1000, // 17 minutos
      order: 4,
      isActive: true,
      isPremium: true,
      totalViews: 680,
      completionRate: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '55',
      title: 'EXTENSÃO DE QUADRIL',
      description: 'Extensão de quadril para glúteos',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video55.mp4',
      duration: 1100, // 18 minutos
      order: 5,
      isActive: true,
      isPremium: true,
      totalViews: 620,
      completionRate: 83,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '56',
      title: 'AGACHAMENTO NA BARRA GUIADA',
      description: 'Agachamento na barra guiada para glúteos',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video56.mp4',
      duration: 1400, // 23 minutos
      order: 6,
      isActive: true,
      isPremium: true,
      totalViews: 580,
      completionRate: 80,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '57',
      title: 'AFUNDO NA BARRA GUIADA',
      description: 'Afundo na barra guiada para glúteos',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video57.mp4',
      duration: 1300, // 22 minutos
      order: 7,
      isActive: true,
      isPremium: true,
      totalViews: 540,
      completionRate: 78,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '58',
      title: 'ABDUÇÃO NO CROSS',
      description: 'Abdução no cross para glúteos',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video58.mp4',
      duration: 1000, // 17 minutos
      order: 8,
      isActive: true,
      isPremium: true,
      totalViews: 480,
      completionRate: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '59',
      title: 'ABDUÇÃO NO CROSS 02',
      description: 'Segunda variação de abdução no cross',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video59.mp4',
      duration: 1100, // 18 minutos
      order: 9,
      isActive: true,
      isPremium: true,
      totalViews: 420,
      completionRate: 82,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '60',
      title: 'ABDUÇÃO',
      description: 'Exercício de abdução para glúteos',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video60.mp4',
      duration: 900, // 15 minutos
      order: 10,
      isActive: true,
      isPremium: true,
      totalViews: 380,
      completionRate: 87,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '61',
      title: 'ABDUÇÃO NA BANDA',
      description: 'Abdução com banda elástica',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video61.mp4',
      duration: 800, // 13 minutos
      order: 11,
      isActive: true,
      isPremium: true,
      totalViews: 350,
      completionRate: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '62',
      title: 'ABDUÇÃO EM 45°',
      description: 'Abdução em 45 graus para glúteos',
      courseId: '7',
      moduleId: '13',
      thumbnail: '/src/assets/course-fitness.jpg',
      videoUrl: 'https://example.com/video62.mp4',
      duration: 950, // 16 minutos
      order: 12,
      isActive: true,
      isPremium: true,
      totalViews: 320,
      completionRate: 84,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    description: '',
    courseId: '',
    moduleId: '',
    thumbnail: '',
    videoUrl: '',
    duration: 0,
    isActive: true,
    isPremium: false
  });

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      ...formData,
      order: lessons.length + 1,
      totalViews: 0,
      completionRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setLessons([...lessons, newLesson]);
    setFormData({
      title: '',
      description: '',
      courseId: '',
      moduleId: '',
      thumbnail: '',
      videoUrl: '',
      duration: 0,
      isActive: true,
      isPremium: false
    });
    setIsAddModalOpen(false);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      courseId: lesson.courseId,
      moduleId: lesson.moduleId,
      thumbnail: lesson.thumbnail,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      isActive: lesson.isActive,
      isPremium: lesson.isPremium
    });
  };

  const handleUpdateLesson = () => {
    if (!editingLesson) return;

    const updatedLessons = lessons.map(lesson =>
      lesson.id === editingLesson.id
        ? { ...lesson, ...formData, updatedAt: new Date() }
        : lesson
    );

    setLessons(updatedLessons);
    setEditingLesson(null);
    setFormData({
      title: '',
      description: '',
      courseId: '',
      moduleId: '',
      thumbnail: '',
      videoUrl: '',
      duration: 0,
      isActive: true,
      isPremium: false
    });
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId));
  };

  const handleToggleActive = (lessonId: string) => {
    setLessons(lessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, isActive: !lesson.isActive }
        : lesson
    ));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getCourseTitle = (courseId: string) => {
    return courses.find(course => course.id === courseId)?.title || 'Curso não encontrado';
  };

  const getModuleTitle = (moduleId: string) => {
    return modules.find(module => module.id === moduleId)?.title || 'Módulo não encontrado';
  };

  const getModulesByCourse = (courseId: string) => {
    return modules.filter(module => module.courseId === courseId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Aulas</h1>
          <p className="text-gray-600">Crie e gerencie suas aulas</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Aula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Aula</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Aula</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Introdução às 7 Chaves"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a aula..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course">Curso</Label>
                  <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value, moduleId: '' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="module">Módulo</Label>
                  <Select value={formData.moduleId} onValueChange={(value) => setFormData({ ...formData, moduleId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.courseId && getModulesByCourse(formData.courseId).map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="videoUrl">URL do Vídeo</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duração (em segundos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  placeholder="1800"
                />
              </div>
              <div>
                <Label>Thumbnail da Aula (16:9)</Label>
                <UploadThumbnail
                  type="lesson"
                  aspectRatio="16:9"
                  maxSize={5}
                  onUpload={(file, url) => setFormData({ ...formData, thumbnail: url })}
                  currentImage={formData.thumbnail}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Aula Ativa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPremium"
                    checked={formData.isPremium}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                  />
                  <Label htmlFor="isPremium">Aula Premium</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddLesson}>
                  Adicionar Aula
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estrutura Hierárquica - Cursos > Módulos > Aulas */}
      <div className="space-y-4">
        {courses.map((course) => {
          const courseModules = modules.filter(module => module.courseId === course.id);
          const courseLessons = lessons.filter(lesson => lesson.courseId === course.id);
          
          return (
            <Card key={course.id} className="border-2 border-gray-200">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {courseModules.length} módulos • {courseLessons.length} aulas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {courseLessons.length} conteúdos
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {courseModules.map((module) => {
                  const moduleLessons = lessons.filter(lesson => 
                    lesson.courseId === course.id && lesson.moduleId === module.id
                  );
                  
                  return (
                    <div key={module.id} className="border-t border-gray-100">
                      <div className="p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <FileText className="w-3 h-3 text-white" />
                            </div>
                            <h3 className="font-medium text-gray-900">{module.title}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {moduleLessons.length} conteúdos
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Lista de Aulas do Módulo */}
                        <div className="space-y-2">
                          {moduleLessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                              <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                  <Play className="w-2 h-2 text-white" />
                                </div>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={lesson.thumbnail}
                                    alt={lesson.title}
                                    className="w-8 h-6 object-cover rounded"
                                  />
                                  <div>
                                    <p className="font-medium text-sm">{lesson.title}</p>
                                    <p className="text-xs text-gray-500">{lesson.description}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Badge variant={lesson.isActive ? "default" : "secondary"}>
                                  {lesson.isActive ? 'Publicado' : 'Inativo'}
                                </Badge>
                                {lesson.isPremium && (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    Premium
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDuration(lesson.duration)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditLesson(lesson)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          {moduleLessons.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                              <p className="text-sm">Nenhuma aula neste módulo</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {courseModules.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">Nenhum módulo neste curso</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal de Edição */}
      {editingLesson && (
        <Dialog open={!!editingLesson} onOpenChange={() => setEditingLesson(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Aula</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título da Aula</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-course">Curso</Label>
                  <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value, moduleId: '' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-module">Módulo</Label>
                  <Select value={formData.moduleId} onValueChange={(value) => setFormData({ ...formData, moduleId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.courseId && getModulesByCourse(formData.courseId).map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-videoUrl">URL do Vídeo</Label>
                <Input
                  id="edit-videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-duration">Duração (em segundos)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Thumbnail da Aula</Label>
                <UploadThumbnail
                  type="lesson"
                  aspectRatio="16:9"
                  maxSize={5}
                  onUpload={(file, url) => setFormData({ ...formData, thumbnail: url })}
                  currentImage={formData.thumbnail}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label>Aula Ativa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isPremium}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                  />
                  <Label>Aula Premium</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingLesson(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateLesson}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}; 