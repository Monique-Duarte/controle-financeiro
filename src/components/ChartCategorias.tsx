import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import { Categoria } from './categories'; // importa a tipagem

interface ChartCategoriasProps {
  categorias: Categoria[];
  valoresPorCategoria: Record<string, number[]>;
}

const coresCategorias = [
  '#000D0A', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#00058F',
  '#14b8a6', '#6B0504', '#0ea5e9', '#BA6EA2', '#6b7280'
];

const renderActiveShape = (props: any) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius,
    startAngle, endAngle, fill, payload, value
  } = props;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

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
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 3 : -6)}
        y={ey}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize={12}
        fill="#333"
      >
        R$ {value}
      </text>
    </g>
  );
};

const ChartCategorias: React.FC<ChartCategoriasProps> = ({ categorias, valoresPorCategoria }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calcula os dados totais por categoria dinamicamente
  const dadosCategorias = useMemo(() => {
    return categorias
      .map((cat, index) => {
        const valores = valoresPorCategoria[cat.id] || [];
        const total = valores.reduce((sum, val) => sum + val, 0);
        return { name: cat.nome, value: total };
      })
      .filter(cat => cat.value > 0); // remove categorias zeradas
  }, [categorias, valoresPorCategoria]);

  const legendPayload = useMemo(() => {
    return dadosCategorias.map((d, index) => ({
      id: d.name,
      value: d.name,
      type: 'square',
      color: coresCategorias[index % coresCategorias.length],
      payloadIndex: index
    }));
  }, [dadosCategorias]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dadosCategorias}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          activeIndex={activeIndex === null ? undefined : activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {dadosCategorias.map((_, index) => (
            <Cell key={`cell-${index}`} fill={coresCategorias[index % coresCategorias.length]} />
          ))}
        </Pie>
        <Legend
          payload={legendPayload}
          onMouseEnter={(e) => setActiveIndex(e.payloadIndex ?? null)}
          onMouseLeave={() => setActiveIndex(null)}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ChartCategorias;