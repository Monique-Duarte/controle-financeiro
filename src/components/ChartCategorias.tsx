import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts';

interface CategoriaData {
  name: string;
  value: number;
}

interface LegendPayload {
  id: string | number;
  value: string;
  type: 'line' | 'square' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
  color: string;
  payloadIndex?: number;
}

const dadosCategorias: CategoriaData[] = [
  { name: 'Casa', value: 500 },
  { name: 'Saúde', value: 200 },
  { name: 'Transporte', value: 300 },
  { name: 'Alimentação', value: 450 },
  { name: 'Mercado', value: 600 },
  { name: 'Pet', value: 150 },
  { name: 'Telefone', value: 100 },
  { name: 'Viagem', value: 350 },
  { name: 'Presente', value: 120 },
  { name: 'Confraternização', value: 180 },
  { name: 'Outros', value: 250 }
];

const coresCategorias = [
  '#000D0A', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#00058F',
  '#14b8a6', '#6B0504', '#0ea5e9', '#BA6EA2', '#6b7280'
];

const legendPayload: LegendPayload[] = dadosCategorias.map((d, index) => ({
  id: d.name,
  value: d.name, // apenas o nome
  type: 'square',
  color: coresCategorias[index % coresCategorias.length],
  payloadIndex: index
}));


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

const ChartCategorias: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const onLegendMouseEnter = (data: LegendPayload) => {
    if (typeof data.payloadIndex === 'number' && data.payloadIndex >= 0) {
      setActiveIndex(data.payloadIndex);
    } else {
      setActiveIndex(null);
    }
  };

  const onLegendMouseLeave = () => {
    setActiveIndex(null);
  };

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
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          animationDuration={300}
        >
          {dadosCategorias.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={coresCategorias[index % coresCategorias.length]} />
          ))}
        </Pie>
        <Legend
          payload={legendPayload}
          onMouseEnter={onLegendMouseEnter}
          onMouseLeave={onLegendMouseLeave}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ChartCategorias;
