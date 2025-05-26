import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import '../../App.css';

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

const GraficoResumo: React.FC<ChartResumoProps> = ({
  receitas = [],
  valoresPorCategoria = {},
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const valorSeguro = (valor: any): number => {
    const n = Number(valor);
    return (valor !== undefined && !isNaN(n)) ? n : 0;
  };

  const totalReceita = valorSeguro(receitas.reduce((acc, val) => acc + valorSeguro(val), 0));
  const totalDespesas = valorSeguro(
    Object.values(valoresPorCategoria).reduce(
      (acc, valores) => acc + valores.reduce((soma, v) => soma + valorSeguro(v), 0),
      0
    )
  );

  const saldo = totalReceita - totalDespesas;
  const temValores = totalReceita > 0 || totalDespesas > 0;

  const dadosResumo: DataItem[] = temValores
    ? [
        { name: 'Receita', value: totalReceita, color: '#3b82f6' },
        { name: 'Despesas', value: totalDespesas, color: '#ef4444' },
      ]
    : [
        { name: 'Sem lançamentos', value: 1, color: '#d1d5db' },
      ];

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);
  const onPieClick = (_: any, index: number) =>
    setActiveIndex(index === activeIndex ? null : index);

  const onLegendClick = (index: number) =>
    setActiveIndex(index === activeIndex ? null : index);

  return (
    <div className="chart-container" style={{ position: 'relative' }}>
      {temValores && (
        <div className={`saldo-text-container ${saldo >= 0 ? 'positivo' : 'negativo'}`}>
          Saldo: R$ {saldo.toFixed(2)}
        </div>
      )}

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
            activeIndex={activeIndex ?? undefined}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onClick={onPieClick}
            labelLine={false}
            label={false}
          >
            {dadosResumo.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                cursor="pointer"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Tooltip customizado */}
      {activeIndex !== null && (
        <div className="custom-tooltip">
          {dadosResumo[activeIndex].name}: R$ {dadosResumo[activeIndex].value.toFixed(2)}
        </div>
      )}

      <div className="chart-legend">
        {temValores && dadosResumo.map((entry, index) => (
          <div
            key={index}
            className={`legend-item ${activeIndex === index ? 'active' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={onPieLeave}
            onClick={() => onLegendClick(index)}
            style={{ cursor: 'pointer' }}
          >
            <span
              className="legend-color"
              style={{ backgroundColor: entry.color }}
            />
            <span className="legend-label">{entry.name}: R$ {entry.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficoResumo;
