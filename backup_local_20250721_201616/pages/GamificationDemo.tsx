import React from 'react';
import { AdvancedGamification } from '@/components/gamification/AdvancedGamification';
import { CommunityChat } from '@/components/community/CommunityChat';
import { FacebookStyleCommunity } from '@/components/community/FacebookStyleCommunity';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const GamificationDemo = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🎮 Demonstração de Gamificação
              </h1>
              <p className="text-sm text-gray-600">
                Teste os componentes de gamificação e comunidade
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sistema de Gamificação */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🏆 Sistema de Gamificação
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Sistema completo de conquistas, badges e níveis com animações e progresso em tempo real.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Conquistas com progresso visual</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Badges com diferentes raridades</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Sistema de níveis com XP</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Animações de desbloqueio</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg">
              <AdvancedGamification />
            </div>
          </div>

          {/* Chat da Comunidade */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                💬 Chat da Comunidade
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Chat em tempo real com mensagens, likes e interface moderna para interação entre usuários.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Mensagens em tempo real</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Sistema de likes e compartilhamento</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Contador de usuários online</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Interface responsiva e animada</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg">
              <CommunityChat courseId="demo" />
            </div>
          </div>

          {/* Comunidade Estilo Facebook */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                📘 Comunidade Estilo Facebook
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Feed de posts com comentários, reações e interface social similar ao Facebook.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Feed de posts com imagens</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Sistema de comentários e reações</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Localização e sentimentos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Interface familiar do Facebook</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <FacebookStyleCommunity courseId="demo" />
            </div>
          </div>
        </div>

        {/* Informações técnicas */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">🔧 Informações Técnicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Banco de Dados</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tabelas: achievements, user_achievements, badges, user_badges</li>
                <li>• Tabelas: user_levels, community_messages</li>
                <li>• RLS (Row Level Security) configurado</li>
                <li>• Índices para performance otimizada</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Funcionalidades</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Animações com Framer Motion</li>
                <li>• Interface responsiva com Tailwind CSS</li>
                <li>• Integração com Supabase</li>
                <li>• Sistema de autenticação</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            onClick={() => toast({
              title: "Funcionalidade",
              description: "Sistema de gamificação implementado com sucesso!",
            })}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            🎮 Testar Gamificação
          </Button>
          
          <Button
            onClick={() => toast({
              title: "Funcionalidade",
              description: "Chat da comunidade funcionando perfeitamente!",
            })}
            variant="outline"
          >
            💬 Testar Chat
          </Button>
          
          <Link to="/demo/premium-course-hero">
            <Button variant="outline">
              🎨 Ver PremiumCourseHero
            </Button>
          </Link>
          
          <Link to="/demo/facebook-community">
            <Button variant="outline">
              📘 Ver Facebook Community
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GamificationDemo; 