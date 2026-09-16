import React from 'react';
import { BlochVector } from '../../types/quantum';
import { BlochSphere3D } from './BlochSphere3D';

interface MultiBlochViewProps {
  blochVectors: BlochVector[];
  onSelectQubit?: (qubitIndex: number) => void;
  selectedQubit?: number;
}

export const MultiBlochView: React.FC<MultiBlochViewProps> = ({
  blochVectors,
  onSelectQubit,
  selectedQubit = 0,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-dark-text tracking-wide uppercase">
            Individual Qubit Bloch Spheres
          </h4>
          <p className="text-xs text-muted-text">
            Derived from each qubit’s reduced density matrix via partial trace{' '}
            <span className="font-mono text-[11px] text-primary-green">ρ_q = Tr_¬q(|Ψ⟩⟨Ψ|)</span>.
          </p>
        </div>
        <div className="text-xs text-muted-text bg-background border border-border px-2.5 py-1 rounded">
          {blochVectors.length} {blochVectors.length === 1 ? 'Qubit' : 'Qubits'} Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blochVectors.map((bv, idx) => {
          const isSelected = selectedQubit === idx;
          const isEntangled = bv.r < 0.98;

          return (
            <div
              key={idx}
              onClick={() => onSelectQubit && onSelectQubit(idx)}
              className={`paper-card p-3 transition-all cursor-pointer ${
                isSelected ? 'ring-2 ring-primary-green border-transparent' : 'hover:border-border-focus'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-dark-text">q{idx}</span>
                <div className="flex items-center space-x-1.5">
                  {isEntangled ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-soft-warm text-warm-accent">
                      Entangled Mixed (r = {bv.r.toFixed(3)})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-soft-green text-primary-green">
                      Pure State (r = 1.0)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-center my-1 bg-[#FDFBF7] rounded border border-border/40 py-2">
                <BlochSphere3D
                  theta={bv.theta}
                  phi={bv.phi}
                  r={bv.r}
                  size={200}
                  interactive={true}
                  purity={bv.purity}
                />
              </div>

              <div className="mt-2 pt-2 border-t border-border/40 grid grid-cols-3 gap-1 text-center font-mono text-xs">
                <div className="bg-background rounded p-1">
                  <span className="text-muted-text text-[10px] block">x</span>
                  <span className="font-semibold text-dark-text">{bv.x.toFixed(3)}</span>
                </div>
                <div className="bg-background rounded p-1">
                  <span className="text-muted-text text-[10px] block">y</span>
                  <span className="font-semibold text-dark-text">{bv.y.toFixed(3)}</span>
                </div>
                <div className="bg-background rounded p-1">
                  <span className="text-muted-text text-[10px] block">z</span>
                  <span className="font-semibold text-dark-text">{bv.z.toFixed(3)}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-text">
                <span>θ = {Math.round((bv.theta * 180) / Math.PI)}°</span>
                <span>φ = {Math.round((bv.phi * 180) / Math.PI)}°</span>
                <span>Purity = {(bv.purity * 100).toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
