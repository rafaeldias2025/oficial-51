import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarDataPoint } from '@/types/session-system';

interface RadarChartProps {
  data: RadarDataPoint[];
  title?: string;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  title = "Roda da Vida", 
  size = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            Nenhum dado disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size * 0.35);
  
  // Criar pontos do radar
  const points = data.map((item, index) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const normalizedValue = Math.min(item.value / 10, 1); // Normalizar para 0-1
    const x = centerX + radius * normalizedValue * Math.cos(angle);
    const y = centerY + radius * normalizedValue * Math.sin(angle);
    
    return {
      ...item,
      x,
      y,
      angle,
      normalizedValue
    };
  });

  // Criar linhas de grade
  const gridLines = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridCircles = gridLines.map(scale => ({
    radius: radius * scale,
    opacity: 0.1 + (scale * 0.1)
  }));

  // Criar linhas dos eixos
  const axisLines = data.map((_, index) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    return {
      x,
      y,
      angle,
      label: data[index].category
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <svg width={size} height={size} className="overflow-visible">
            {/* Círculos de grade */}
            {gridCircles.map((circle, index) => (
              <circle
                key={index}
                cx={centerX}
                cy={centerY}
                r={circle.radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity={circle.opacity}
              />
            ))}

            {/* Linhas dos eixos */}
            {axisLines.map((line, index) => (
              <g key={index}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={line.x}
                  y2={line.y}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
                <text
                  x={line.x + Math.cos(line.angle) * 20}
                  y={line.y + Math.sin(line.angle) * 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-gray-600"
                  style={{ fontSize: '10px' }}
                >
                  {line.label}
                </text>
              </g>
            ))}

            {/* Área do radar */}
            {points.length > 2 && (
              <path
                d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`}
                fill="rgba(59, 130, 246, 0.2)"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
              />
            )}

            {/* Pontos do radar */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={point.color || "#3b82f6"}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={point.x}
                  y={point.y - 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium"
                  style={{ fontSize: '10px' }}
                >
                  {point.value}
                </text>
              </g>
            ))}

            {/* Círculo central */}
            <circle
              cx={centerX}
              cy={centerY}
              r="3"
              fill="#3b82f6"
            />
          </svg>
        </div>

        {/* Legenda */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color || "#3b82f6" }}
              />
              <span className="text-gray-600">{item.category}</span>
              <span className="font-medium">{item.value}/10</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 