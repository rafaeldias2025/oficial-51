import React from 'react';
import { 
  Home, 
  Users, 
  CreditCard,
  DollarSign,
  FileText,
  Settings,
  Grid,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Início', active: false },
  { icon: Users, label: 'Área de Membros', active: true },
  { icon: CreditCard, label: 'Assinaturas', active: false },
  { icon: DollarSign, label: 'Financeiro', active: false },
  { icon: FileText, label: 'Relatórios', active: false },
  { icon: Users, label: 'Colaboradores', active: false },
  { icon: Grid, label: 'Apps', active: false },
  { icon: HelpCircle, label: 'Ajuda', active: false },
];

interface KwifySidebarProps {
  onBack?: () => void;
}

export const KwifySidebar: React.FC<KwifySidebarProps> = ({ onBack }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white">
      <nav className="p-4">
        {/* Botão Voltar */}
        {onBack && (
          <button
            onClick={onBack}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-4 bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        )}

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              item.active 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}; 