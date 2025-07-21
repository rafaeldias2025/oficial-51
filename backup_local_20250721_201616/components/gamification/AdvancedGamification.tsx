import React from 'react';

interface AdvancedGamificationProps {
  courseId?: string;
}

export const AdvancedGamification: React.FC<AdvancedGamificationProps> = ({ courseId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Sistema de Gamificação</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">5</span>
          </div>
          <h3 className="font-semibold mb-2">Nível Atual</h3>
          <p className="text-gray-600 text-sm">Experiência: 2.450 XP</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">12</span>
          </div>
          <h3 className="font-semibold mb-2">Conquistas</h3>
          <p className="text-gray-600 text-sm">Desbloqueadas</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">3</span>
          </div>
          <h3 className="font-semibold mb-2">Missões</h3>
          <p className="text-gray-600 text-sm">Em Andamento</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Próximas Conquistas</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Primeira Semana Completa</span>
            <span className="text-green-600">✓ Concluída</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>10 Pesagens Registradas</span>
            <span className="text-yellow-600">7/10</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Meta de Peso Atingida</span>
            <span className="text-blue-600">Em Progresso</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 