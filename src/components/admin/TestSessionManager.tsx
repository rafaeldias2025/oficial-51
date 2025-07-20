import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TestSessionManager = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teste do Gerenciador de Sessões</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Este é um teste do componente SessionManager.</p>
          <p>Se você está vendo esta mensagem, o componente está sendo renderizado corretamente.</p>
          <p>Dados das ferramentas de coaching criadas:</p>
          <ul className="list-disc list-inside mt-4">
            <li>Roda da Saúde Galileu - 16 perguntas</li>
            <li>Relacionamentos - 20 perguntas</li>
            <li>SistemizeCoach - 30 perguntas</li>
          </ul>
          <p className="mt-4">Sessão criada para o usuário de teste com a Roda da Saúde Galileu.</p>
        </CardContent>
      </Card>
    </div>
  );
}; 