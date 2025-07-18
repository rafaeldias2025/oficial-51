export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  price: number;
  is_active: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for compatibility
  coverImage?: string;
  progress?: number;
  duration?: string;
  rating?: number;
  studentsCount?: number;
  status?: 'not-started' | 'in-progress' | 'completed';
  instructor?: string;
}

export const simulatedCourses: Course[] = [
  {
    id: '1',
    title: 'Reeducação Alimentar Definitiva',
    category: 'Nutrição',
    description: 'Aprenda os fundamentos de uma alimentação saudável e sustentável para toda a vida. Descubra como fazer escolhas inteligentes.',
    image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 199.99,
    is_active: true,
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 65,
    duration: '4h 30min',
    rating: 4.8,
    studentsCount: 1240,
    status: 'in-progress',
    instructor: 'Dr. Ana Silva'
  },
  {
    id: '2',
    title: 'Mindfulness para Emagrecimento',
    category: 'Psicologia',
    description: 'Técnicas de atenção plena aplicadas ao processo de emagrecimento consciente. Transforme sua relação com a comida.',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 149.99,
    is_active: true,
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '3h 15min',
    rating: 4.9,
    studentsCount: 856,
    status: 'not-started',
    instructor: 'Dra. Maria Santos'
  },
  {
    id: '3',
    title: 'Exercícios em Casa: Do Básico ao Avançado',
    category: 'Atividade Física',
    description: 'Programa completo de exercícios para fazer em casa, sem equipamentos. Desenvolva força, resistência e flexibilidade.',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 99.99,
    is_active: true,
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 100,
    duration: '6h 45min',
    rating: 4.7,
    studentsCount: 2150,
    status: 'completed',
    instructor: 'Prof. João Costa'
  },
  {
    id: '4',
    title: 'Gerenciamento de Estresse e Ansiedade',
    category: 'Bem-estar',
    description: 'Estratégias práticas para lidar com o estresse e ansiedade no dia a dia. Encontre seu equilíbrio interior.',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 79.99,
    is_active: true,
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 25,
    duration: '2h 50min',
    rating: 4.6,
    studentsCount: 674,
    status: 'in-progress',
    instructor: 'Dra. Clara Oliveira'
  },
  {
    id: '5',
    title: 'Meditação e Autocuidado',
    category: 'Mindfulness',
    description: 'Desenvolva uma prática de meditação consistente e aprenda técnicas de autocuidado para uma vida mais plena.',
    image_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 129.99,
    is_active: true,
    coverImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    progress: 0,
    duration: '5h 20min',
    rating: 4.8,
    studentsCount: 920,
    status: 'not-started',
    instructor: 'Mestre Marina Lima'
  }
];

export const categories = [
  'Nutrição',
  'Psicologia', 
  'Atividade Física',
  'Bem-estar',
  'Mindfulness'
];