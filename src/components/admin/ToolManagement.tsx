import React, { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  category: string;
}

export const ToolManagement: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([
    {
      id: '1',
      name: 'Avaliação de Saúde',
      description: 'Questionário completo de saúde e bem-estar',
      status: 'active',
      category: 'Saúde'
    },
    {
      id: '2',
      name: 'Teste de Motivação',
      description: 'Avaliação de motivação e objetivos',
      status: 'active',
      category: 'Psicologia'
    },
    {
      id: '3',
      name: 'Avaliação Nutricional',
      description: 'Questionário sobre hábitos alimentares',
      status: 'inactive',
      category: 'Nutrição'
    }
  ]);

  const toggleStatus = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id 
        ? { ...tool, status: tool.status === 'active' ? 'inactive' : 'active' }
        : tool
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Ferramentas</h2>
      
      <div className="mb-6">
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
          + Nova Ferramenta
        </button>
      </div>
      
      <div className="space-y-4">
        {tools.map(tool => (
          <div key={tool.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{tool.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                tool.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {tool.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-2">{tool.description}</p>
            <span className="text-sm text-gray-500">Categoria: {tool.category}</span>
            
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => toggleStatus(tool.id)}
                className={`px-4 py-2 rounded ${
                  tool.status === 'active'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {tool.status === 'active' ? 'Desativar' : 'Ativar'}
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                Editar
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                Ver Estatísticas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 