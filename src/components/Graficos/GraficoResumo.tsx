import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import '../../styles/Graficos.css';

interface GraficoResumoProps {
  receitas: number[];
  valoresPorCategoria: Record<string, number[]>;
}

const GraficoResumo: React.FC<GraficoResumoProps> = ({
  receitas,
  valoresPorCategoria,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalReceitas = useMemo(() => {
    return receitas.reduce((acc, val) => acc + val, 0);
  }, [receitas]);

  const totalDespesas = useMemo(() => {
    return Object.values(valoresPorCategoria)
      .flat()
      .reduce((acc, val) => acc + val, 0);
  }, [valoresPorCategoria]);

  const dadosResumo = useMemo(
    () => [
      { name: 'Receitas', value: totalReceitas, color: '#10b981' },
      { name: 'Despesas', value: totalDespesas, color: '#ef4444' },
    ],
    [totalReceitas, totalDespesas]
  );

  const onBarClick = (_: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  const onLegendClick = (index: number) =>
    setActiveIndex(index === activeIndex ? null : index);

  const saldo = totalReceitas - totalDespesas;

  if (totalReceitas === 0 && totalDespesas === 0) {
    return <p className="no-data-message">Nenhum dado para exibir.</p>;
  }

  return (
    <div className="chart-container" style={{ position: 'relative' }}>
      <h2 className="chart-title">Resumo Financeiro</h2>

      <div
        className={`saldo-text-container ${
          saldo >= 0 ? 'positivo' : 'negativo'
        }`}
      >
        Saldo: R$ {saldo.toFixed(2)}
      </div>

      <ResponsiveContainer width="100%" aspect={1}>
        <BarChart data={dadosResumo} onClick={(e: any) => onBarClick(e, e?.activeTooltipIndex)}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            content={null} // desabilita tooltip padrão
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
              {((entry.value / (totalReceitas + totalDespesas)) * 100).toFixed(1)}
              %)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficoResumo;
