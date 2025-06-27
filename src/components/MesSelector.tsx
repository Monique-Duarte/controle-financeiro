import React from 'react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MesSelectorProps {
  mesesDisponiveis: string[];
  mesSelecionado: string;
  onChange: (mes: string) => void;
}

const MesSelector: React.FC<MesSelectorProps> = ({
  mesesDisponiveis,
  mesSelecionado,
  onChange,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
      <select
        value={mesSelecionado}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '14px',
        }}
      >
        {mesesDisponiveis.map((mes) => {
          const data = parse(mes, 'yyyy-MM', new Date());
          const label = format(data, 'MMMM/yyyy', { locale: ptBR });
          return (
            <option key={mes} value={mes}>
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default MesSelector;
