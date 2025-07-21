import React, { useState } from 'react';
import { Course } from '@/hooks/useCourses';

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  status: 'draft' | 'published';
}

interface ModuleEditorProps {
  course?: Course;
  onBack?: () => void;
}

export const ModuleEditor: React.FC<ModuleEditorProps> = ({ course, onBack }) => {
  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: 'Fundamentos de Meditação',
      description: 'Aprenda os princípios básicos da meditação',
      lessons: 5,
      duration: '2h 30min',
      status: 'published'
    },
    {
      id: '2',
      title: 'Técnicas de Respiração',
      description: 'Exercícios para melhorar a respiração',
      lessons: 3,
      duration: '1h 45min',
      status: 'draft'
    }
  ]);

  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const handleEdit = (module: Module) => {
    setEditingModule(module);
  };

  const handleSave = () => {
    if (editingModule) {
      setModules(modules.map(m => 
        m.id === editingModule.id ? editingModule : m
      ));
      setEditingModule(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Editor de Módulos</h2>
      
      <div className="mb-6">
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
          + Novo Módulo
        </button>
      </div>
      
      <div className="space-y-4">
        {modules.map(module => (
          <div key={module.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{module.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                module.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {module.status === 'published' ? 'Publicado' : 'Rascunho'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-2">{module.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>{module.lessons} aulas</span>
              <span>{module.duration}</span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleEdit(module)}
                className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90"
              >
                Editar
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                Gerenciar Aulas
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
                Visualizar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {editingModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Editar Módulo</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editingModule.title}
                onChange={(e) => setEditingModule({...editingModule, title: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Título do módulo"
              />
              <textarea
                value={editingModule.description}
                onChange={(e) => setEditingModule({...editingModule, description: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Descrição"
                rows={3}
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                >
                  Salvar
                </button>
                <button 
                  onClick={() => setEditingModule(null)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 