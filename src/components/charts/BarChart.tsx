import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartDataPoint } from '@/types/session-system';

interface BarChartProps {
  data: BarChartDataPoint[];
  title?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title = "Análise por Categoria", 
  height = 300 
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

  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = 40;
  const barSpacing = 20;
  const chartWidth = data.length * (barWidth + barSpacing) + barSpacing;
  const chartHeight = height - 80; // Espaço para labels

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <svg width={chartWidth} height={height} className="overflow-visible">
            {/* Linha de base */}
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="#e5e7eb"
              strokeWidth="1"
            />

            {/* Barras */}
            {data.map((item, index) => {
              const x = index * (barWidth + barSpacing) + barSpacing;
              const barHeight = (item.value / maxValue) * chartHeight;
              const y = chartHeight - barHeight;

              return (
                <g key={index}>
                  {/* Barra */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={item.color || "#3b82f6"}
                    rx="4"
                    className="transition-all duration-300 hover:opacity-80"
                  />

                  {/* Valor na barra */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-gray-700"
                  >
                    {item.value}
                  </text>

                  {/* Porcentagem */}
                  <text
                    x={x + barWidth / 2}
                    y={y + barHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium fill-white"
                  >
                    {item.percentage.toFixed(0)}%
                  </text>

                  {/* Label da categoria */}
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-gray-600"
                    style={{ fontSize: '10px' }}
                  >
                    {item.category}
                  </text>
                </g>
              );
            })}

            {/* Linhas de grade horizontais */}
            {[0.25, 0.5, 0.75, 1].map((scale, index) => {
              const y = chartHeight - (scale * chartHeight);
              return (
                <g key={index}>
                  <line
                    x1={0}
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={-10}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="text-xs fill-gray-400"
                  >
                    {Math.round(maxValue * scale)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legenda */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: item.color || "#3b82f6" }}
              />
              <span className="text-gray-600">{item.category}</span>
              <span className="font-medium">{item.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 