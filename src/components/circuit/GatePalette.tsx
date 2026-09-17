import React from 'react';
import { GateType } from '../../types/quantum';
import { GATE_DEFINITIONS } from '../../quantum/gates';

interface GatePaletteProps {
  selectedGate: GateType | null;
  onSelectGate: (gate: GateType) => void;
  isExplorerMode: boolean;
  selectedAngle?: number;
  onSelectAngle?: (angle: number) => void;
}

export const GatePalette: React.FC<GatePaletteProps> = ({
  selectedGate,
  onSelectGate,
  isExplorerMode,
  selectedAngle = Math.PI / 2,
  onSelectAngle,
}) => {
  const commonGates: GateType[] = ['X', 'Y', 'Z', 'H', 'S', 'T', 'CX', 'CZ'];
  const advancedGates: GateType[] = ['Sdg', 'Tdg', 'SqrtX', 'SqrtY', 'Rx', 'Ry', 'Rz', 'Phase', 'SWAP', 'CCX'];

  const isSelectedGateParameterized =
    selectedGate && GATE_DEFINITIONS[selectedGate]?.isParameterized;

  const currentDegrees = Math.round((selectedAngle * 180) / Math.PI);

  const presetAngles = [
    { label: 'π/4 (45°)', value: Math.PI / 4 },
    { label: 'π/2 (90°)', value: Math.PI / 2 },
    { label: 'π (180°)', value: Math.PI },
    { label: '3π/2 (270°)', value: (3 * Math.PI) / 2 },
  ];

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

        {/* Parameter angle configuration toolbar if parameterized gate selected */}
        {isSelectedGateParameterized && onSelectAngle && (
          <div className="pt-2 mt-2 border-t border-border/60 bg-background/50 p-2 rounded">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-dark-text">
                Rotation Angle (θ): <span className="font-mono text-primary-green">{currentDegrees}°</span>
              </span>
              <span className="text-[10px] font-mono text-muted-text">
                {(selectedAngle / Math.PI).toFixed(2)}π rad
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {presetAngles.map(preset => {
                const isActive = Math.abs(selectedAngle - preset.value) < 1e-4;
                return (
                  <button
                    key={preset.label}
                    onClick={() => onSelectAngle(preset.value)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                      isActive
                        ? 'bg-primary-green text-white border-primary-green font-bold'
                        : 'bg-surface border-border text-dark-text hover:border-primary-green'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={currentDegrees}
              onChange={e => onSelectAngle((parseFloat(e.target.value) * Math.PI) / 180)}
              className="w-full accent-primary-green cursor-pointer h-1.5"
            />
          </div>
        )}
      </div>
    </div>
  );
};
