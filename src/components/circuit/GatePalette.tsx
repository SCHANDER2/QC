import React from 'react';
import { GateType } from '../../types/quantum';
import { GATE_DEFINITIONS } from '../../quantum/gates';

interface GatePaletteProps {
  selectedGate: GateType | null;
  onSelectGate: (gate: GateType) => void;
  isExplorerMode: boolean;
}

export const GatePalette: React.FC<GatePaletteProps> = ({
  selectedGate,
  onSelectGate,
  isExplorerMode,
}) => {
  const commonGates: GateType[] = ['X', 'Y', 'Z', 'H', 'S', 'T', 'CX', 'CZ'];
  const advancedGates: GateType[] = ['Sdg', 'Tdg', 'SqrtX', 'SqrtY', 'Rx', 'Ry', 'Rz', 'Phase', 'SWAP', 'CCX'];

  const renderGateButton = (gate: GateType) => {
    const def = GATE_DEFINITIONS[gate];
    const isSelected = selectedGate === gate;

    // Distinct restrained background accents
    let bgStyle = 'bg-surface hover:border-primary-green text-dark-text';
    if (isSelected) {
      bgStyle = 'bg-primary-green text-white border-primary-green font-bold shadow-sm';
    } else if (gate === 'X' || gate === 'CX') {
      bgStyle = 'bg-[#FBEAE5] border-[#E8C5BC] hover:border-warm-accent text-[#8C3A21]';
    } else if (gate === 'H') {
      bgStyle = 'bg-soft-green border-[#C3D7CA] hover:border-primary-green text-primary-green';
    } else if (gate === 'Z' || gate === 'CZ') {
      bgStyle = 'bg-[#EBF1F5] border-[#C2D4DF] hover:border-[#386D8C] text-[#24526E]';
    } else if (gate === 'Y') {
      bgStyle = 'bg-[#FDF3E5] border-[#EBD0B0] hover:border-[#A66D29] text-[#784A12]';
    }

    return (
      <button
        key={gate}
        onClick={() => onSelectGate(gate)}
        className={`px-3 py-1.5 rounded border text-xs font-mono transition-all flex items-center justify-center min-w-[42px] ${bgStyle}`}
        title={`${def.name}: ${def.description}`}
      >
        <span>{def.symbol}</span>
      </button>
    );
  };

  return (
    <div className="paper-card p-3 select-none">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-dark-text">
          Gate Palette
        </span>
        <span className="text-[11px] text-muted-text">
          {selectedGate ? `Selected: ${GATE_DEFINITIONS[selectedGate].name}` : 'Click gate to place on wire'}
        </span>
      </div>

      <div className="space-y-2">
        {/* Core gates */}
        <div>
          <span className="text-[10px] text-muted-text uppercase font-semibold block mb-1">
            Common Gates
          </span>
          <div className="flex flex-wrap gap-1.5">{commonGates.map(renderGateButton)}</div>
        </div>

        {/* Explorer / Advanced gates */}
        {isExplorerMode && (
          <div className="pt-2 border-t border-border/60">
            <span className="text-[10px] text-muted-text uppercase font-semibold block mb-1">
              Advanced & Rotations
            </span>
            <div className="flex flex-wrap gap-1.5">{advancedGates.map(renderGateButton)}</div>
          </div>
        )}
      </div>
    </div>
  );
};
