import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
} from 'recharts';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

const receita = 4000;
const despesas = 2500;
const saldo = receita - despesas;

const dadosResumo: DataItem[] = [
  { name: 'Receita', value: receita, color: '#3b82f6' },
  { name: 'Despesas', value: despesas, color: '#ef4444' }
];

// Clamp simples para limitar valores
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius,
    startAngle, endAngle, fill,
  } = props;

  const zoomRadius = outerRadius + 10;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={zoomRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const ChartResumo: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);
  const onLegendMouseEnter = (index: number) => setActiveIndex(index);
  const onLegendMouseLeave = () => setActiveIndex(null);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dadosResumo}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          activeIndex={activeIndex === null ? undefined : activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          animationDuration={300}
          label={false}
          labelLine={false}
        >
          {dadosResumo.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              style={{
                transformOrigin: '50% 50%',
                transition: 'transform 0.3s ease',
                transform: activeIndex === index ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          ))}
        </Pie>

        {/* SALDO CENTRAL */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="bold"
          fill={saldo >= 0 ? '#10b981' : '#ef4444'}
        >
          Saldo: R$ {saldo}
        </text>

        {/* LEGENDA PERSONALIZADA */}
        <g>
          {dadosResumo.map((entry, index) => {
            const midAngle = index === 0 ? 60 : 240;
            const cx = 150;
            const cy = 150;
            const outerRadius = 80;
            const radian = Math.PI / 180;

            const sx = cx + outerRadius * Math.cos(-midAngle * radian);
            const sy = cy + outerRadius * Math.sin(-midAngle * radian);
            const mx = cx + (outerRadius + 50) * Math.cos(-midAngle * radian);
            const my = cy + (outerRadius + 50) * Math.sin(-midAngle * radian);

            let ex = mx + (mx > cx ? 5 : -5);
            ex = clamp(ex, 5, 290);

            const ey = my;
            const isActive = activeIndex === index;

            return (
              <g key={`callout-${index}`}>
                <path
                  d={
                    index === 1
                      ? `M${sx},${sy} L${ex},${ey} L${mx},${my}`
                      : `M${sx},${sy} L${mx},${my} L${ex},${ey}`
                  }
                  stroke={entry.color}
                  fill="none"
                  style={{ pointerEvents: 'none' }}
                />
                <text
                  x={ex + (mx > cx ? 1 : 135)}
                  y={ey}
                  textAnchor={mx > cx ? 'start' : 'end'}
                  dominantBaseline="middle"
                  fill={isActive ? entry.color : '#555'}
                  style={{
                    fontWeight: isActive ? '700' : '500',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'fill 0.3s ease',
                  }}
                  onMouseEnter={() => onLegendMouseEnter(index)}
                  onMouseLeave={onLegendMouseLeave}
                >
                  {`${entry.name}: R$ ${entry.value}`}
                </text>
              </g>
            );
          })}
        </g>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ChartResumo;
