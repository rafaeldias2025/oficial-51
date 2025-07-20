import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const NetflixThemeTest: React.FC = () => {
  return (
    <div className="min-h-screen netflix-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-netflix-text mb-8">
          Teste do Tema Netflix
        </h1>
        
        {/* Teste de Cores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="netflix-card">
            <CardHeader>
              <CardTitle className="text-netflix-text">Background Preto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-netflix-text-muted">
                Este card deve ter fundo cinza escuro (#141414)
              </p>
            </CardContent>
          </Card>
          
          <Card className="netflix-card">
            <CardHeader>
              <CardTitle className="text-netflix-text">Texto Branco</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-netflix-text-muted">
                Este texto deve ser branco (#FFFFFF)
              </p>
            </CardContent>
          </Card>
          
          <Card className="netflix-card">
            <CardHeader>
              <CardTitle className="text-netflix-text">Vermelho Netflix</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-netflix-red">
                Este texto deve ser vermelho Netflix (#E50914)
              </p>
            </CardContent>
          </Card>
          
          <Card className="netflix-card">
            <CardHeader>
              <CardTitle className="text-netflix-text">Botão Netflix</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="bg-netflix-red hover:bg-netflix-red/90">
                Botão Vermelho Netflix
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Teste de Gradientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="netflix-card">
            <CardHeader>
              <CardTitle className="text-netflix-text">Gradiente Netflix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 gradient-netflix rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Gradiente Netflix</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="netflix-card">
            <CardHeader>
              <CardTitle className="text-netflix-text">Gradiente Escuro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 gradient-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Gradiente Escuro</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Status do Tema */}
        <Card className="netflix-card">
          <CardHeader>
            <CardTitle className="text-netflix-text">Status do Tema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-netflix-red rounded-full"></div>
                <span className="text-netflix-text">Vermelho Netflix: #E50914</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-black rounded-full"></div>
                <span className="text-netflix-text">Background: #000000</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                <span className="text-netflix-text">Card: #141414</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-white rounded-full"></div>
                <span className="text-netflix-text">Texto: #FFFFFF</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 