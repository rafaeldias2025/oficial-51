import React, { useState } from 'react';

interface CommunityChatProps {
  courseId?: string;
}

export const CommunityChat: React.FC<CommunityChatProps> = ({ courseId }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Aqui seria implementada a lógica de envio
      console.log('Mensagem enviada:', message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Comunidade</h2>
      
      <div className="h-64 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm font-semibold mb-1">Maria Silva</p>
                <p className="text-gray-700">Parabéns a todos que completaram a missão de hoje! 👏</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">10:30</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">J</span>
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm font-semibold mb-1">João Santos</p>
                <p className="text-gray-700">Alguém tem dicas para manter a motivação? 💪</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">10:25</span>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}; 