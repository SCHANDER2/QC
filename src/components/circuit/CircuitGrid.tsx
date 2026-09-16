import React from 'react';
import { CircuitStep, GateOperation, GateType } from '../../types/quantum';
import { GATE_DEFINITIONS } from '../../quantum/gates';
import { Plus, Trash2, X as CloseIcon } from 'lucide-react';

interface CircuitGridProps {
  numQubits: number;
  steps: CircuitStep[];
  currentStepIndex: number;
  selectedGateType: GateType | null;
  onAddOperation: (op: GateOperation, stepIndex?: number) => void;
  onRemoveOperation: (opId: string) => void;
  onAddQubit: () => void;
  onRemoveQubit: () => void;
  onStepClick: (stepIndex: number) => void;
}

export const CircuitGrid: React.FC<CircuitGridProps> = ({
  numQubits,
  steps,
  currentStepIndex,
  selectedGateType,
  onAddOperation,
  onRemoveOperation,
  onAddQubit,
  onRemoveQubit,
  onStepClick,
}) => {
  // Ensure we display at least 8 step columns so the user can easily click empty slots
  const minColumns = Math.max(8, steps.length + 2);
  const columns = Array.from({ length: minColumns }, (_, i) => i);

  // Map operations by [qubitIndex][stepIndex]
  const opGrid: { [key: string]: GateOperation } = {};
  steps.forEach((step, sIdx) => {
    step.operations.forEach(op => {
      // Register for targets and controls
      op.targets.forEach(t => {
        opGrid[`${t}_${sIdx}`] = op;
      });
      if (op.controls) {
        op.controls.forEach(c => {
          opGrid[`${c}_${sIdx}`] = op;
        });
      }
    });
  });

  const handleCellClick = (qIdx: number, sIdx: number) => {
    const existingOp = opGrid[`${qIdx}_${sIdx}`];
    if (existingOp) {
      // Remove clicked gate
      onRemoveOperation(existingOp.id);
      return;
    }

    if (!selectedGateType) return;

    const def = GATE_DEFINITIONS[selectedGateType];
    const newId = `op_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    if (selectedGateType === 'CX') {
      const controlQ = qIdx;
      const targetQ = (qIdx + 1) % numQubits;
      onAddOperation(
        {
          id: newId,
          gate: 'CX',
          targets: [targetQ],
          controls: [controlQ],
        },
        sIdx
      );
    } else if (selectedGateType === 'CZ') {
      const controlQ = qIdx;
      const targetQ = (qIdx + 1) % numQubits;
      onAddOperation(
        {
          id: newId,
          gate: 'CZ',
          targets: [targetQ],
          controls: [controlQ],
        },
        sIdx
      );
    } else if (selectedGateType === 'SWAP') {
      const target2 = (qIdx + 1) % numQubits;
      onAddOperation(
        {
          id: newId,
          gate: 'SWAP',
          targets: [qIdx, target2],
        },
        sIdx
      );
    } else if (selectedGateType === 'CCX') {
      if (numQubits >= 3) {
        onAddOperation(
          {
            id: newId,
            gate: 'CCX',
            targets: [(qIdx + 2) % numQubits],
            controls: [qIdx, (qIdx + 1) % numQubits],
          },
          sIdx
        );
      }
    } else if (def.isParameterized) {
      onAddOperation(
        {
          id: newId,
          gate: selectedGateType,
          targets: [qIdx],
          params: def.defaultParams || [Math.PI / 2],
        },
        sIdx
      );
    } else {
      // Standard single-qubit gate
      onAddOperation(
        {
          id: newId,
          gate: selectedGateType,
          targets: [qIdx],
        },
        sIdx
      );
    }
  };

  return (
    <div className="paper-card p-4 overflow-x-auto select-none">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-dark-text tracking-wider uppercase">
            Quantum Circuit Wireframe
          </span>
          <span className="text-xs text-muted-text">
            Basis: <code className="font-mono text-primary-green">|q0 q1 ... q{numQubits - 1}⟩</code>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onAddQubit}
            disabled={numQubits >= 8}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded border border-border bg-surface hover:bg-soft-green hover:border-primary-green text-dark-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Add Qubit wire"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Qubit</span>
          </button>
          <button
            onClick={onRemoveQubit}
            disabled={numQubits <= 1}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded border border-border bg-surface hover:bg-soft-warm hover:border-warm-accent text-dark-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Remove bottom Qubit wire"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Qubit</span>
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative min-w-[650px]">
        {/* Step Column Headers */}
        <div className="flex ml-14 mb-2">
          {columns.map(sIdx => {
            const isCursor = currentStepIndex === sIdx + 1;
            return (
              <div
                key={sIdx}
                onClick={() => onStepClick(sIdx + 1)}
                className={`w-14 text-center cursor-pointer font-mono text-[11px] transition-colors py-0.5 rounded ${
                  isCursor
                    ? 'bg-primary-green text-white font-bold'
                    : 'text-muted-text hover:text-dark-text hover:bg-background'
                }`}
              >
                t={sIdx + 1}
              </div>
            );
          })}
        </div>

        {/* Qubit Wires */}
        {Array.from({ length: numQubits }, (_, qIdx) => (
          <div key={qIdx} className="flex items-center h-14 relative group">
            {/* Qubit Label */}
            <div className="w-14 flex items-center justify-between pr-3 font-mono text-xs font-semibold text-dark-text border-r-2 border-border/80">
              <span>q{qIdx}</span>
              <span className="text-[10px] text-muted-text font-normal">|0⟩</span>
            </div>

            {/* Horizontal Wire Line */}
            <div className="absolute left-14 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-border group-hover:bg-muted-text/60 transition-colors pointer-events-none" />

            {/* Step Slots */}
            <div className="flex flex-1 relative z-10">
              {columns.map(sIdx => {
                const op = opGrid[`${qIdx}_${sIdx}`];
                const isCursor = currentStepIndex === sIdx + 1;

                // Check for multi-qubit connections in this step
                let isControl = false;
                let hasVerticalLine = false;
                let lineTop = false;
                let lineBottom = false;

                if (op) {
                  if (op.controls && op.controls.includes(qIdx)) {
                    isControl = true;
                  }

                  // Find vertical span
                  const allQubitsInOp = [...(op.controls || []), ...op.targets];
                  const minQ = Math.min(...allQubitsInOp);
                  const maxQ = Math.max(...allQubitsInOp);

                  if (allQubitsInOp.length > 1 && qIdx >= minQ && qIdx <= maxQ) {
                    hasVerticalLine = true;
                    lineTop = qIdx > minQ;
                    lineBottom = qIdx < maxQ;
                  }
                }

                return (
                  <div
                    key={sIdx}
                    onClick={() => handleCellClick(qIdx, sIdx)}
                    className={`w-14 h-14 flex items-center justify-center relative cursor-pointer group/cell ${
                      isCursor ? 'bg-soft-green/30' : ''
                    }`}
                  >
                    {/* Vertical connector line for multi-qubit gates */}
                    {hasVerticalLine && (
                      <div
                        className="absolute w-[2px] bg-[#17211D] z-0 pointer-events-none"
                        style={{
                          top: lineTop ? '0%' : '50%',
                          bottom: lineBottom ? '0%' : '50%',
                          left: 'calc(50% - 1px)',
                        }}
                      />
                    )}

                    {/* Gate Node or Empty Slot */}
                    {op ? (
                      <div className="relative z-10 flex items-center justify-center">
                        {isControl ? (
                          // Control Point: solid black dot
                          <div
                            className="w-3.5 h-3.5 rounded-full bg-[#17211D] shadow-sm flex items-center justify-center"
                            title={`Control on q${qIdx}`}
                          />
                        ) : op.gate === 'CX' ? (
                          // CNOT Target: ⊕ circle with plus
                          <div
                            className="w-7 h-7 rounded-full bg-surface border-2 border-[#17211D] flex items-center justify-center font-bold text-base leading-none text-[#17211D] shadow-sm hover:scale-105 transition-transform"
                            title="CNOT Target (X)"
                          >
                            ⊕
                          </div>
                        ) : op.gate === 'CZ' ? (
                          // CZ Target: Z box
                          <div
                            className="w-7 h-7 rounded bg-surface border-2 border-[#17211D] flex items-center justify-center font-bold text-xs text-[#17211D] shadow-sm hover:scale-105 transition-transform"
                            title="CZ Target (Z)"
                          >
                            Z
                          </div>
                        ) : op.gate === 'SWAP' ? (
                          // SWAP Target: ×
                          <div
                            className="w-7 h-7 flex items-center justify-center font-bold text-lg text-[#17211D] leading-none"
                            title="SWAP"
                          >
                            ✕
                          </div>
                        ) : (
                          // Standard Gate Box
                          <div
                            className="w-8 h-8 rounded border border-border bg-surface shadow-sm flex flex-col items-center justify-center hover:border-primary-green hover:shadow transition-all group/gate"
                            title={`${op.gate} Gate: Click to remove`}
                          >
                            <span className="font-mono text-xs font-bold text-dark-text">
                              {GATE_DEFINITIONS[op.gate]?.symbol || op.gate}
                            </span>
                            {op.params && (
                              <span className="text-[9px] text-muted-text -mt-1 font-mono">
                                {Math.round((op.params[0] * 180) / Math.PI)}°
                              </span>
                            )}
                            <div className="absolute -top-1.5 -right-1.5 hidden group-hover/gate:flex w-3.5 h-3.5 bg-warm-accent text-white rounded-full items-center justify-center">
                              <CloseIcon className="w-2.5 h-2.5" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Empty clickable slot placeholder
                      <div className="w-4 h-4 rounded-full border border-dashed border-border/50 group-hover/cell:border-primary-green group-hover/cell:scale-125 transition-all" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
