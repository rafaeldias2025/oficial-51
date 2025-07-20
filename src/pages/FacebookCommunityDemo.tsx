import React from 'react';
import { FacebookStyleCommunity } from '@/components/community/FacebookStyleCommunity';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const FacebookCommunityDemo = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/demo/gamification">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📘 Comunidade Estilo Facebook
              </h1>
              <p className="text-sm text-gray-600">
                Feed de posts com comentários, reações e interface social
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Componente Facebook */}
      <div className="pt-4">
        <FacebookStyleCommunity courseId="facebook-demo" />
      </div>

      {/* Informações flutuantes */}
      <div className="fixed bottom-4 right-4 space-y-2">
        <Button
          onClick={() => toast({
            title: "Funcionalidade",
            description: "Comunidade estilo Facebook implementada com sucesso!",
          })}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          📘 Testar Facebook
        </Button>
        
        <Link to="/demo/gamification">
          <Button variant="outline" className="shadow-lg">
            🎮 Voltar para Gamificação
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FacebookCommunityDemo; 