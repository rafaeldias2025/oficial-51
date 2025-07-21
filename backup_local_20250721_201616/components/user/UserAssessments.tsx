import React from 'react';

export const UserAssessments: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Minhas Avaliações</h2>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Avaliação de Saúde</h3>
          <p className="text-gray-600 mb-2">Última avaliação: 15/07/2024</p>
          <div className="flex gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              Concluída
            </span>
            <button className="text-primary hover:underline">Ver Detalhes</button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Avaliação de Bem-estar</h3>
          <p className="text-gray-600 mb-2">Pendente</p>
          <div className="flex gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
              Pendente
            </span>
            <button className="text-primary hover:underline">Iniciar</button>
          </div>
        </div>
      </div>
    </div>
  );
}; 