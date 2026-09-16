import React from 'react';
import { PRESET_STATES } from '../quantum/presets';
import { GitBranch, Play, CheckCircle2 } from 'lucide-react';

interface CircuitsViewProps {
  onLoadAndSimulate: (presetId: string) => void;
}

export const CircuitsView: React.FC<CircuitsViewProps> = ({ onLoadAndSimulate }) => {
  return (
    <div className="space-y-6 select-none">
      <div>
        <span className="text-[11px] font-bold tracking-widest text-muted-text uppercase block mb-1">
          Circuit Library & Algorithms
        </span>
        <h1 className="text-3xl font-bold font-serif text-dark-text tracking-tight flex items-center space-x-2">
          <GitBranch className="w-7 h-7 text-primary-green" />
          <span>Benchmark Quantum Circuits</span>
        </h1>
        <p className="text-xs text-muted-text max-w-2xl leading-relaxed mt-1">
          Explore canonical quantum protocols that demonstrate quantum advantage, entanglement, teleportation, and interference. Load any circuit directly into the step-by-step simulator.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRESET_STATES.map(preset => (
          <div
            key={preset.id}
            className="paper-card-interactive p-5 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-primary-green">
                  {preset.numQubits} {preset.numQubits === 1 ? 'Qubit' : 'Qubits'} • {preset.circuit.length} Gates
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-background border border-border text-dark-text font-semibold">
                  {preset.latexFormula}
                </span>
              </div>

              <h3 className="text-base font-bold font-serif text-dark-text mb-1 group-hover:text-primary-green transition-colors">
                {preset.name}
              </h3>

              <p className="text-xs text-muted-text leading-relaxed mb-3">
                {preset.description}
              </p>

              {/* Wire diagram mini-preview */}
              <div className="p-2.5 bg-background rounded border border-border/70 font-mono text-[11px] space-y-1 overflow-x-auto">
                {preset.circuit.length === 0 ? (
                  <span className="text-muted-text italic">q0 ────── (Ground state |0⟩)</span>
                ) : (
                  <div className="space-y-1">
                    {Array.from({ length: preset.numQubits }, (_, q) => {
                      const opsOnQ = preset.circuit.filter(
                        op => op.targets.includes(q) || (op.controls && op.controls.includes(q))
                      );
                      const symbols = opsOnQ.map(op => {
                        if (op.controls && op.controls.includes(q)) return '●';
                        if (op.gate === 'CX') return '⊕';
                        if (op.gate === 'SWAP') return '✕';
                        return op.gate;
                      });
                      return (
                        <div key={q} className="text-muted-text">
                          <span className="text-dark-text font-bold">q{q}</span> ──{' '}
                          {symbols.length > 0 ? symbols.join(' ── ') : '──────'} ──
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-muted-text">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-green" />
                <span>Verified Unitary</span>
              </div>

              <button
                onClick={() => onLoadAndSimulate(preset.id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-primary-green hover:bg-primary-green-hover text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Circuit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
