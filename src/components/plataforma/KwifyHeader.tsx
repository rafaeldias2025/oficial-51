import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Eye } from 'lucide-react';

export const KwifyHeader = () => {
  return (
    <header className="bg-green-600 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Plataforma dos Sonhos</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">R$ 0.6K / R$ 10K</span>
            <div className="w-24 h-2 bg-white/20 rounded-full">
              <div className="w-1/2 h-full bg-white rounded-full"></div>
            </div>
          </div>
          <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <Eye className="w-4 h-4 mr-2" />
            Pré-visualizar
          </Button>
          <div className="relative">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <span className="mr-2">rafael ferreira dias</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}; 