import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import './ChartResumo.css';

interface ChartResumoProps {
  receitas?: number[];
  valoresPorCategoria?: Record<string, number[]>;
}

interface DataItem {
  name: string;
  value: number;
  color: string;
}

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

const ChartResumo: React.FC<ChartResumoProps> = ({
  receitas = [],
  valoresPorCategoria = {},
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalReceita = receitas.reduce((acc, val) => acc + val, 0);
  const totalDespesas = Object.values(valoresPorCategoria).reduce(
    (acc, valores) => acc + valores.reduce((soma, v) => soma + v, 0),
    0
  );

  const saldo = totalReceita - totalDespesas;
  const temValores = totalReceita > 0 || totalDespesas > 0;

  const dadosResumo: DataItem[] = temValores
    ? [
      { name: 'Receita', value: totalReceita, color: '#3b82f6' },
      { name: 'Despesas', value: totalDespesas, color: '#ef4444' },
    ]
    : [
      { name: 'Sem lançamentos', value: 1, color: '#d1d5db' }, // cinza
    ];

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  return (
    <div className="chart-container">

      {!temValores && (
        <div className="sem-lancamentos-msg">
          Nenhum lançamento registrado
        </div>
      )}

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
            activeIndex={temValores ? activeIndex ?? undefined : undefined}
            activeShape={temValores ? renderActiveShape : undefined}
            onMouseEnter={temValores ? onPieEnter : undefined}
            onMouseLeave={temValores ? onPieLeave : undefined}
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
                  transform: temValores && activeIndex === index ? 'scale(1.1)' : 'scale(1)',
                }}
              />
            ))}
          </Pie>

          {temValores && (
            <text
              className={`saldo-text ${saldo >= 0 ? 'positivo' : 'negativo'}`}
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Saldo: R$ {saldo.toFixed(2)}
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        <div
          className={`legend-item ${activeIndex === 0 ? 'active' : ''}`}
          onMouseEnter={() => setActiveIndex(0)}
          onMouseLeave={onPieLeave}
        >
          <span className="legend-color legend-receita" />
          <span className="legend-label">Receita: R$ {totalReceita.toFixed(2)}</span>
        </div>
        <div
          className={`legend-item ${activeIndex === 1 ? 'active' : ''}`}
          onMouseEnter={() => setActiveIndex(1)}
          onMouseLeave={onPieLeave}
        >
          <span className="legend-color legend-despesa" />
          <span className="legend-label">Despesas: R$ {totalDespesas.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ChartResumo;