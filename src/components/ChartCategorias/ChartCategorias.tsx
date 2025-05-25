import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { categoriasPredefinidas } from '../categoriasPredefinidas';
import './ChartCategorias.css';

interface ChartCategoriasProps {
  valoresPorCategoria: Record<string, number[]>;
}

interface DataItem {
  name: string;
  value: number;
  color: string;
}

const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10} 
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#333" className="label-name">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#333" className="label-value">
        R$ {value}
      </text>
      <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#999" className="label-percent">
        ({(percent * 100).toFixed(1)}%)
      </text>
    </g>
  );
};

const ChartCategorias: React.FC<ChartCategoriasProps> = ({ valoresPorCategoria }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calcula o total geral
  const totalGeral = Object.values(valoresPorCategoria)
    .flat()
    .reduce((acc, v) => acc + v, 0);

  // Se não tiver valor, cria dados com valor 0 e cor cinza
  const dadosDespesas: DataItem[] = totalGeral === 0
    ? [{
      name: 'Nenhum lançamento',
      value: 1,
      color: '#ccc',
    }]
    : categoriasPredefinidas
      .map((cat) => {
        const valores = valoresPorCategoria[cat.id] || [];
        const total = valores.reduce((acc, v) => acc + v, 0);
        return {
          name: cat.nome,
          value: total,
          color: cat.cor,
        };
      })
      .filter((item) => item.value > 0);

  // Formata o total ou mostra mensagem caso zero
  const totalFormatado = totalGeral > 0
    ? totalGeral.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    : 'Nenhum lançamento registrado';

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  return (
    <div className="chart-container">

      <div className="chart-title chart-total">{totalFormatado}</div>
      <ResponsiveContainer width="100%" aspect={1}>
        <PieChart>
          <Pie
            data={dadosDespesas}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            activeIndex={activeIndex ?? undefined}
            activeShape={renderActiveShape}
            onMouseEnter={totalGeral === 0 ? undefined : onPieEnter}
            onMouseLeave={totalGeral === 0 ? undefined : onPieLeave}
          >
            {dadosDespesas.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        {totalGeral === 0
          ? <div className="no-data-message">Sem dados para exibir</div>
          : dadosDespesas.map((item, index) => (
            <div
              key={index}
              className={`legend-item${activeIndex === index ? ' active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span className="legend-color" style={{ backgroundColor: item.color }} />
              <span className="legend-label">{item.name}</span>
              <span className="legend-value">
                {((item.value / totalGeral) * 100).toFixed(1)}%
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ChartCategorias;
