import React from 'react';
import { PremiumCourseHero } from '@/components/courses/PremiumCourseHero';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumCourseHeroDemo = () => {
  const { toast } = useToast();

  // Dados de exemplo para o curso premium
  const sampleCourse = {
    id: '1',
    title: 'Transformação Completa: Do Zero ao Herói',
    description: 'Um programa revolucionário que combina psicologia, nutrição e fitness para transformar sua vida em 30 dias. Aprenda técnicas exclusivas que já transformaram mais de 5.000 vidas.',
    hero_image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    price: 297.00,
    is_premium: true,
    instructor_name: 'Michelle Feiteira',
    duration_hours: 25,
    difficulty_level: 'Intermediário',
    category: 'Transformação Pessoal'
  };

  const handleStartCourse = () => {
    toast({
      title: "🎉 Curso Iniciado!",
      description: "Você começou o curso 'Transformação Completa: Do Zero ao Herói'",
    });
  };

  const handlePreviewCourse = () => {
    toast({
      title: "👀 Preview Disponível",
      description: "Abrindo preview do curso...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Demo: PremiumCourseHero</h1>
        </div>

        {/* Informações da demo */}
        <div className="mb-8 p-6 bg-white/10 rounded-lg border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">📋 Sobre o Componente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
            <div>
              <h3 className="font-semibold text-white mb-2">✨ Características:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Animações Framer Motion</li>
                <li>• Design responsivo</li>
                <li>• Gradientes modernos</li>
                <li>• Badges premium</li>
                <li>• Botões interativos</li>
                <li>• Overlays elegantes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">🎯 Funcionalidades:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Callbacks para ações</li>
                <li>• Exibição condicional</li>
                <li>• Fallbacks inteligentes</li>
                <li>• TypeScript completo</li>
                <li>• Acessibilidade</li>
                <li>• Performance otimizada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Componente em teste */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-white mb-6">🎨 Demonstração do Componente</h2>
          
          {/* Versão Premium */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">💎 Versão Premium</h3>
            <PremiumCourseHero
              course={sampleCourse}
              onStartCourse={handleStartCourse}
              onPreviewCourse={handlePreviewCourse}
            />
          </div>

          {/* Versão Gratuita */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">🆓 Versão Gratuita</h3>
            <PremiumCourseHero
              course={{
                ...sampleCourse,
                title: 'Introdução à Transformação Pessoal',
                description: 'Aprenda os fundamentos básicos da transformação pessoal com este curso gratuito.',
                price: 0,
                is_premium: false,
                duration_hours: 3,
                difficulty_level: 'Iniciante'
              }}
              onStartCourse={handleStartCourse}
              onPreviewCourse={handlePreviewCourse}
            />
          </div>

          {/* Versão com dados mínimos */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">📝 Versão Mínima</h3>
            <PremiumCourseHero
              course={{
                id: '3',
                title: 'Curso Básico',
                description: 'Um curso simples para demonstrar o componente com dados mínimos.',
                price: 99.90,
                is_premium: true
              }}
              onStartCourse={handleStartCourse}
              onPreviewCourse={handlePreviewCourse}
            />
          </div>
        </div>

        {/* Instruções de uso */}
        <div className="mt-12 p-6 bg-white/10 rounded-lg border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">📖 Como Usar</h2>
          <div className="text-white/80 space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">1. Importar o componente:</h3>
              <code className="block bg-black/30 p-3 rounded text-sm">
                {`import { PremiumCourseHero } from '@/components/courses/PremiumCourseHero';`}
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">2. Definir os dados do curso:</h3>
              <code className="block bg-black/30 p-3 rounded text-sm">
                {`const course = {
  id: '1',
  title: 'Título do Curso',
  description: 'Descrição do curso...',
  price: 297.00,
  is_premium: true,
  // ... outros campos opcionais
};`}
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">3. Implementar os callbacks:</h3>
              <code className="block bg-black/30 p-3 rounded text-sm">
                {`const handleStartCourse = () => {
  // Lógica para iniciar o curso
};

const handlePreviewCourse = () => {
  // Lógica para mostrar preview
};`}
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">4. Usar o componente:</h3>
              <code className="block bg-black/30 p-3 rounded text-sm">
                {`<PremiumCourseHero
  course={course}
  onStartCourse={handleStartCourse}
  onPreviewCourse={handlePreviewCourse}
/>`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCourseHeroDemo; 