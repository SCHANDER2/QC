import React, { useState } from 'react';
import { BlochSphere3D } from '../components/visualization/BlochSphere3D';
import { ComplexNumber } from '../quantum/complex';
import { PRESET_STATES } from '../quantum/presets';
import { QuantumCircuit } from '../quantum/circuit';
import { BarChart3, Activity, Layers, ArrowRight } from 'lucide-react';

interface VisualizationsViewProps {
  onNavigateToSimulator: (presetId?: string) => void;
}

export const VisualizationsView: React.FC<VisualizationsViewProps> = ({
  onNavigateToSimulator,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bell_phi_plus');

  const preset = PRESET_STATES.find(p => p.id === selectedPresetId) || PRESET_STATES[6];
  const circuit = QuantumCircuit.fromOperations(preset.numQubits, preset.circuit);
  const snapshots = circuit.simulate();
  const finalSnapshot = snapshots[snapshots.length - 1];

  return (
    <div className="space-y-6 select-none">
      <div>
        <span className="text-[11px] font-bold tracking-widest text-muted-text uppercase block mb-1">
          State Space Visualizations
        </span>
        <h1 className="text-3xl font-bold font-serif text-dark-text tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-7 h-7 text-primary-green" />
          <span>Quantum State Visualizations</span>
        </h1>
        <p className="text-xs text-muted-text max-w-2xl leading-relaxed mt-1">
          Examine statevectors, 3D Bloch spheres, and reduced density matrices across canonical quantum states.
        </p>
      </div>

      {/* Preset State Selector Bar */}
      <div className="paper-card p-3 flex flex-wrap gap-2">
        {PRESET_STATES.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPresetId(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedPresetId === p.id
                ? 'bg-primary-green text-white font-bold shadow-xs'
                : 'bg-surface border border-border text-dark-text hover:bg-soft-green hover:border-primary-green'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* 2-Column Visualization Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Multi-Bloch Spheres (6 / 12) */}
        <div className="lg:col-span-6 paper-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-primary-green" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark-text">
                Reduced Bloch Spheres (ρ_q)
              </h3>
            </div>
            <span className="text-xs font-mono text-muted-text">
              {preset.numQubits} {preset.numQubits === 1 ? 'Qubit' : 'Qubits'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {finalSnapshot.blochVectors.map(bv => (
              <div key={bv.qubitIndex} className="bg-background rounded-lg p-3 border border-border/60 text-center">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-dark-text">q{bv.qubitIndex}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      bv.r < 0.95 ? 'bg-soft-warm text-warm-accent' : 'bg-soft-green text-primary-green'
                    }`}
                  >
                    {bv.r < 0.95 ? `Mixed (r = ${bv.r.toFixed(3)})` : 'Pure (r = 1.0)'}
                  </span>
                </div>
                <div className="flex justify-center my-1 bg-surface rounded py-2 border border-border/40">
                  <BlochSphere3D theta={bv.theta} phi={bv.phi} r={bv.r} size={180} interactive={false} />
                </div>
                <div className="mt-2 text-[11px] font-mono text-muted-text grid grid-cols-3 gap-1">
                  <span>x: {bv.x.toFixed(2)}</span>
                  <span>y: {bv.y.toFixed(2)}</span>
                  <span>z: {bv.z.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-muted-text leading-relaxed">
            Note: For entangled states like Bell pairs, notice the local Bloch vector collapses toward the origin (0, 0, 0) because the local reduced state is maximally mixed!
          </div>
        </div>

        {/* Right: Statevector Probability Distribution (6 / 12) */}
        <div className="lg:col-span-6 paper-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-warm-accent" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark-text">
                Computational Basis Probability Distribution
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-primary-green">
              Σ P = 1.0
            </span>
          </div>

          <div className="space-y-2">
            {finalSnapshot.probabilities.map((prob, idx) => {
              const basis = `|${idx.toString(2).padStart(preset.numQubits, '0')}⟩`;
              const amp = finalSnapshot.statevector[idx];
              const percent = (prob * 100).toFixed(1);
              const isNonZero = prob > 0.001;

              return (
                <div key={idx} className="flex items-center text-xs font-mono">
                  <span className={`w-16 font-bold ${isNonZero ? 'text-primary-green' : 'text-muted-text/50'}`}>
                    {basis}
                  </span>
                  <div className="flex-1 h-5 bg-background rounded overflow-hidden mx-2 border border-border/40 relative">
                    <div
                      className="h-full bg-primary-green transition-all duration-300 rounded-sm"
                      style={{ width: `${percent}%` }}
                    />
                    {isNonZero && (
                      <span className="absolute inset-y-0 left-2 flex items-center text-[10px] text-dark-text font-bold">
                        {ComplexNumber.from(amp).toString(3)}
                      </span>
                    )}
                  </div>
                  <span className="w-14 text-right font-semibold text-dark-text text-[11px]">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border/60 flex justify-end">
            <button
              onClick={() => onNavigateToSimulator(selectedPresetId)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-primary-green hover:bg-primary-green-hover text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Inspect in Circuit Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
