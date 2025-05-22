import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import './ChartResumo.css';

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

  return (
    <div className="chart-container">

      <div className="chart-title">Resumo Financeiro</div>
      <div className="chart-legend">
        {dadosResumo.map((entry, index) => (
          <div
            key={index}
            className={`legend-item ${activeIndex === index ? 'active' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={onPieLeave}
          >
            <span
              className="legend-color"
              style={{ backgroundColor: entry.color }}
            />
            <span className="legend-label">
              {entry.name}: R$ {entry.value}
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" aspect={1}>
        <PieChart>
          <Pie
            data={dadosResumo}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            activeIndex={activeIndex ?? undefined}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationDuration={300}
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

          <text
            className={`saldo-text ${saldo >= 0 ? 'positivo' : 'negativo'}`}
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Saldo: R$ {saldo}
          </text>
        </PieChart>
      </ResponsiveContainer>

    </div>
  );
};

export default ChartResumo;
