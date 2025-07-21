import React from 'react';
import { ToolManager } from '@/components/admin/ToolManager';

export const ToolsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToolManager />
      </div>
    </div>
  );
}; 