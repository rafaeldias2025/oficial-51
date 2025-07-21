import React from 'react';

interface UserSessionsProps {
  onStartSession?: (sessionId: string) => void;
}

export const UserSessions: React.FC<UserSessionsProps> = ({ onStartSession }) => {
  const sessions = [
    {
      id: '1',
      title: 'Sessão de Meditação',
      duration: '15 min',
      status: 'completed',
      date: '2024-07-20'
    },
    {
      id: '2',
      title: 'Exercícios de Respiração',
      duration: '10 min',
      status: 'in_progress',
      date: '2024-07-20'
    },
    {
      id: '3',
      title: 'Yoga Matinal',
      duration: '30 min',
      status: 'pending',
      date: '2024-07-21'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'in_progress': return 'Em Andamento';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Minhas Sessões</h2>
      
      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{session.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(session.status)}`}>
                {getStatusText(session.status)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Duração: {session.duration}</span>
              <span>Data: {session.date}</span>
            </div>
            
            <div className="mt-3 flex gap-2">
              <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
                {session.status === 'pending' ? 'Iniciar' : 'Continuar'}
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 