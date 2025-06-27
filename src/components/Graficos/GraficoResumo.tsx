import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import '../../styles/Graficos.css';

interface GraficoResumoProps {
  totalReceitasMensal: number;
  totalDespesasMensal: number;
}

const GraficoResumo: React.FC<GraficoResumoProps> = ({
  totalReceitasMensal,
  totalDespesasMensal,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const dadosResumo = useMemo(
    () => [
      { name: 'Receitas', value: totalReceitasMensal, color: '#10b981' },
      { name: 'Despesas', value: totalDespesasMensal, color: '#ef4444' },
    ],
    [totalReceitasMensal, totalDespesasMensal]
  );

  const onBarClick = (_: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  const onLegendClick = (index: number) =>
    setActiveIndex(index === activeIndex ? null : index);

  const saldoMensal = totalReceitasMensal - totalDespesasMensal;

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const currentMonthName = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const titleText = `Saldo ${currentMonthName}/${currentYear}: R$ ${saldoMensal.toFixed(2)}`;

  if (totalReceitasMensal === 0 && totalDespesasMensal === 0) {
    return <p className="no-data-message">Nenhum dado para exibir para {currentMonthName}/{currentYear}.</p>;
  }

  return (
    <div className="chart-container" style={{ position: 'relative' }}>
      <div
        className={`saldo-text-container ${
          saldoMensal >= 0 ? 'positivo' : 'negativo'
        }`}
      >
        {titleText}
      </div>

      <ResponsiveContainer width="100%" aspect={1}>
        <BarChart data={dadosResumo} onClick={(e: any) => onBarClick(e, e?.activeTooltipIndex)}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            content={null}
          />
          <Bar dataKey="value" onClick={(data, index) => onBarClick(data, index)}>
            {dadosResumo.map((entry, index) => (
              <Cell
                key={`bar-${index}`}
                fill={entry.color}
                cursor="pointer"
                opacity={activeIndex !== null && activeIndex !== index ? 0.5 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        {dadosResumo.map((entry, index) => (
          <div
            key={index}
            className={`legend-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => onLegendClick(index)}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{ cursor: 'pointer' }}
          >
            <span
              className="legend-color"
              style={{
                backgroundColor: entry.color,
              }}
            />
            <span className="legend-label">
              {entry.name} (
              {((entry.value / (totalReceitasMensal + totalDespesasMensal)) * 100).toFixed(1)}
              %)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficoResumo;