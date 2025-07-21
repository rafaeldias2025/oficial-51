import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GaugeChartProps {
  value: number;
  maxValue?: number;
  title?: string;
  size?: number;
  color?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value, 
  maxValue = 100, 
  title = "Pontuação Geral", 
  size = 200,
  color = "#3b82f6"
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Ângulos para o gauge (180 graus)
  const startAngle = Math.PI;
  const endAngle = 0;
  const angleRange = endAngle - startAngle;
  const currentAngle = startAngle + (percentage / 100) * angleRange;
  
  // Cores baseadas na pontuação
  const getGaugeColor = (percentage: number) => {
    if (percentage >= 80) return "#10b981"; // Verde
    if (percentage >= 60) return "#f59e0b"; // Amarelo
    if (percentage >= 40) return "#f97316"; // Laranja
    return "#ef4444"; // Vermelho
  };
  
  const gaugeColor = getGaugeColor(percentage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <svg width={size} height={size} className="overflow-visible">
            {/* Fundo do gauge */}
            <path
              d={`M ${centerX - radius * Math.cos(startAngle)} ${centerY - radius * Math.sin(startAngle)} A ${radius} ${radius} 0 0 1 ${centerX - radius * Math.cos(endAngle)} ${centerY - radius * Math.sin(endAngle)}`}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Gauge preenchido */}
            <path
              d={`M ${centerX - radius * Math.cos(startAngle)} ${centerY - radius * Math.sin(startAngle)} A ${radius} ${radius} 0 0 1 ${centerX - radius * Math.cos(currentAngle)} ${centerY - radius * Math.sin(currentAngle)}`}
              fill="none"
              stroke={gaugeColor}
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Indicador central */}
            <circle
              cx={centerX}
              cy={centerY}
              r="8"
              fill="white"
              stroke={gaugeColor}
              strokeWidth="2"
            />
            
            {/* Valor central */}
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl font-bold"
              fill={gaugeColor}
            >
              {Math.round(percentage)}
            </text>
            
            {/* Label de porcentagem */}
            <text
              x={centerX}
              y={centerY + 25}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-500"
            >
              %
            </text>
            
            {/* Marcadores de escala */}
            {[0, 25, 50, 75, 100].map((mark) => {
              const angle = startAngle + (mark / 100) * angleRange;
              const x1 = centerX - (radius + 5) * Math.cos(angle);
              const y1 = centerY - (radius + 5) * Math.sin(angle);
              const x2 = centerX - (radius + 15) * Math.cos(angle);
              const y2 = centerY - (radius + 15) * Math.sin(angle);
              
              return (
                <g key={mark}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />
                  <text
                    x={centerX - (radius + 30) * Math.cos(angle)}
                    y={centerY - (radius + 30) * Math.sin(angle)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-gray-500"
                  >
                    {mark}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Informações adicionais */}
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600">
            Pontuação: {value}/{maxValue}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {percentage >= 80 && "Excelente! Continue assim!"}
            {percentage >= 60 && percentage < 80 && "Bom trabalho! Há espaço para melhorar."}
            {percentage >= 40 && percentage < 60 && "Regular. Foque nas áreas de melhoria."}
            {percentage < 40 && "Precisa de atenção. Considere buscar ajuda."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 