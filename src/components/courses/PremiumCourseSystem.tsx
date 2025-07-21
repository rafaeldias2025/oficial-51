import React from 'react';

interface PremiumCourseSystemProps {
  courseId?: string;
}

export const PremiumCourseSystem: React.FC<PremiumCourseSystemProps> = ({ courseId }) => {
  const premiumCourses = [
    {
      id: '1',
      title: 'Meditação Avançada',
      description: 'Técnicas avançadas de meditação e mindfulness',
      price: 'R$ 197,00',
      duration: '8 semanas',
      lessons: 24,
      level: 'Avançado',
      features: ['Certificado', 'Suporte Premium', 'Comunidade Exclusiva']
    },
    {
      id: '2',
      title: 'Nutrição Funcional',
      description: 'Aprenda a alimentar-se de forma saudável e equilibrada',
      price: 'R$ 297,00',
      duration: '12 semanas',
      lessons: 36,
      level: 'Intermediário',
      features: ['Plano Alimentar', 'Consultoria', 'Receitas Exclusivas']
    },
    {
      id: '3',
      title: 'Fitness Personalizado',
      description: 'Programa de exercícios adaptado ao seu perfil',
      price: 'R$ 397,00',
      duration: '16 semanas',
      lessons: 48,
      level: 'Todos os Níveis',
      features: ['Avaliação Física', 'Treinos Personalizados', 'Acompanhamento']
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Cursos Premium</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumCourses.map(course => (
          <div key={course.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-br from-primary to-accent p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-white/90 mb-4">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{course.price}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {course.level}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>⏱️ {course.duration}</span>
                <span>📚 {course.lessons} aulas</span>
              </div>
              
              <div className="space-y-2 mb-6">
                {course.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-semibold">
                Inscrever-se Agora
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Benefícios Premium</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🎓</span>
            </div>
            <h4 className="font-semibold mb-2">Certificados</h4>
            <p className="text-gray-600 text-sm">Certificados reconhecidos em todos os cursos</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">👥</span>
            </div>
            <h4 className="font-semibold mb-2">Comunidade</h4>
            <p className="text-gray-600 text-sm">Acesso exclusivo à comunidade premium</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💬</span>
            </div>
            <h4 className="font-semibold mb-2">Suporte</h4>
            <p className="text-gray-600 text-sm">Suporte prioritário e personalizado</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 