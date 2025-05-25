import React, { useState } from 'react';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts';
import { DespesaTipo } from '../../types/tipos';
import { categoriasPredefinidas } from '../categoriasPredefinidas';
import { somarValoresPorCategoria } from '../../utils/somaPorCategorias';

interface Props {
  despesas: DespesaTipo[];
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

const ChartCategoria: React.FC<Props> = ({ despesas }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const somaPorCategoria = somarValoresPorCategoria(despesas);

  const total = Object.values(somaPorCategoria).reduce((acc, val) => acc + val, 0);

  const data = Object.entries(somaPorCategoria).map(([id, valor]) => {
    const categoria = categoriasPredefinidas.find(cat => cat.id === id);
    return {
      name: categoria?.nome || id,
      value: valor,
      fill: categoria?.cor || '#8884d8',
      percent: total > 0 ? (valor / total) * 100 : 0,
    };
  });

  if (data.length === 0) return <p>Nenhuma despesa para mostrar.</p>;

  // Handler para quando o mouse entra no gráfico
  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  // Quando sai do gráfico, reseta
  const onPieLeave = () => setActiveIndex(null);

  // Quando clicar na legenda, ativa/desativa o índice para mostrar animação + tooltip
  const onLegendClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="chart-container" style={{ position: 'relative' }}>
      <h2 className="chart-title">Despesas por Categoria</h2>

      <ResponsiveContainer width="100%" aspect={1}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            activeIndex={activeIndex ?? undefined}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onClick={(_: any, index: number) => setActiveIndex(index)}
            labelLine={false}
            label={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`slice-${index}`}
                fill={entry.fill}
                cursor="pointer"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Tooltip customizado que aparece quando ativo */}
      {activeIndex !== null && (
        <div className="custom-tooltip">
          {data[activeIndex].name}: R$ {data[activeIndex].value.toFixed(2)} <br />
          ({data[activeIndex].percent.toFixed(1)}%)
        </div>
      )}


      <div className="chart-legend">
        {data.map((entry, index) => (
          <div
            key={index}
            className={`legend-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => onLegendClick(index)}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={onPieLeave}
            style={{ cursor: 'pointer' }}
          >
            <span
              className="legend-color"
              style={{ backgroundColor: entry.fill, width: 12, height: 12, borderRadius: '50%', display: 'inline-block', marginRight: 8 }}
            />
            <span className="legend-label">
              {entry.name} ({entry.percent.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartCategoria;
