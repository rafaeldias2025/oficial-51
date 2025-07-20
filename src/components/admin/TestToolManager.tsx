import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const TestToolManager = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTools = async () => {
    try {
      setLoading(true);
      console.log('🔍 TestToolManager: Carregando ferramentas...');
      
      const { data, error } = await supabase
        .from('coaching_tools' as any)
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ TestToolManager: Erro ao carregar ferramentas:', error);
        throw error;
      }
      
      console.log('✅ TestToolManager: Ferramentas carregadas:', data);
      setTools(data || []);
    } catch (err) {
      console.error('❌ TestToolManager: Erro ao carregar ferramentas:', err);
      setError('Erro ao carregar ferramentas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Carregando ferramentas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro: {error}</p>
        <Button onClick={loadTools} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Teste - Ferramentas de Coaching</h2>
        <p className="text-muted-foreground">
          Total de ferramentas encontradas: {tools.length}
        </p>
      </div>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader>
              <CardTitle>{tool.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Categoria:</strong> {tool.category}</p>
                <p><strong>Perguntas:</strong> {tool.total_questions}</p>
                <p><strong>Tempo:</strong> {tool.estimated_time} min</p>
                <p><strong>Descrição:</strong> {tool.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma ferramenta encontrada</p>
        </div>
      )}
    </div>
  );
}; 