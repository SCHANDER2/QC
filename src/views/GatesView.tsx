import React, { useState } from 'react';
import { GATE_DEFINITIONS, getGateMatrix2x2 } from '../quantum/gates';
import { GateType } from '../types/quantum';
import { DensityMatrixUtils } from '../quantum/density';
import { QuantumEngine } from '../quantum/engine';
import { BlochSphere3D } from '../components/visualization/BlochSphere3D';
import { Grid, Sparkles, BookOpen } from 'lucide-react';

export const GatesView: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<GateType>('H');
  const [initialStateKey, setInitialStateKey] = useState<'0' | '1' | 'plus'>('0');
  const [rotationAngleDeg, setRotationAngleDeg] = useState<number>(90);

  const def = GATE_DEFINITIONS[selectedGate];
  const rad = (rotationAngleDeg * Math.PI) / 180;
  const matrix = def.numQubits === 1 ? getGateMatrix2x2(selectedGate, [rad]) : null;

  // Prepare initial state
  let initState = DensityMatrixUtils.stateFromAngles(0, 0); // |0>
  if (initialStateKey === '1') initState = DensityMatrixUtils.stateFromAngles(Math.PI, 0); // |1>
  if (initialStateKey === 'plus') initState = DensityMatrixUtils.stateFromAngles(Math.PI / 2, 0); // |+>

  // Apply gate
  let outputState = initState;
  if (def.numQubits === 1) {
    outputState = QuantumEngine.applyOperation(initState, {
      id: 'g_preview',
      gate: selectedGate,
      targets: [0],
      params: def.isParameterized ? [rad] : undefined,
    });
  }

  const inBv = DensityMatrixUtils.getBlochVector(initState, 0);
  const outBv = DensityMatrixUtils.getBlochVector(outputState, 0);

  const allGateKeys = Object.keys(GATE_DEFINITIONS) as GateType[];

  return (
    <div className="space-y-6 select-none">
      <div>
        <span className="text-[11px] font-bold tracking-widest text-muted-text uppercase block mb-1">
          Interactive Gate Directory
        </span>
        <h1 className="text-3xl font-bold font-serif text-dark-text tracking-tight flex items-center space-x-2">
          <Grid className="w-7 h-7 text-primary-green" />
          <span>Quantum Gates & Unitary Operators</span>
        </h1>
        <p className="text-xs text-muted-text max-w-2xl leading-relaxed mt-1">
          Unitary matrices are norm-preserving, reversible linear transformations. Inspect their mathematical definitions, Dirac algebra, and 3D Bloch sphere transformations.
        </p>
      </div>

      {/* Gate Selector Bar */}
      <div className="paper-card p-3 flex flex-wrap gap-1.5">
        {allGateKeys.map(gateKey => {
          const isSelected = selectedGate === gateKey;
          const gDef = GATE_DEFINITIONS[gateKey];
          return (
            <button
              key={gateKey}
              onClick={() => setSelectedGate(gateKey)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                isSelected
                  ? 'bg-primary-green text-white font-bold shadow-xs'
                  : 'bg-surface border border-border text-dark-text hover:bg-soft-green hover:border-primary-green'
              }`}
            >
              {gDef.symbol}
            </button>
          );
        })}
      </div>

      {/* Main Gate Details 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Properties & Mathematical Matrix (6 / 12) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="paper-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h3 className="text-lg font-bold font-serif text-dark-text">
                  {def.name} ({def.symbol})
                </h3>
                <span className="text-[11px] text-muted-text uppercase tracking-wider">
                  Category: {def.category} • {def.numQubits} Qubit
                </span>
              </div>
              <div className="px-2.5 py-1 rounded bg-soft-green text-primary-green text-xs font-mono font-bold">
                Unitary U†U = I
              </div>
            </div>

            <p className="text-xs text-dark-text leading-relaxed">{def.description}</p>

            {/* Matrix Display */}
            {matrix && (
              <div className="p-3 bg-background rounded-lg border border-border space-y-2">
                <span className="text-[10px] font-bold text-muted-text uppercase tracking-wider block">
                  Matrix Representation
                </span>
                <div className="flex items-center space-x-3 font-mono text-xs">
                  <span className="text-sm font-bold text-dark-text">U =</span>
                  <div className="border-l-2 border-r-2 border-dark-text px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-2 text-center bg-surface rounded">
                    <span>{matrix[0][0].toString(3)}</span>
                    <span>{matrix[0][1].toString(3)}</span>
                    <span>{matrix[1][0].toString(3)}</span>
                    <span>{matrix[1][1].toString(3)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Parameter slider for rotation gates */}
            {def.isParameterized && (
              <div className="p-3 bg-background rounded-lg border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-dark-text">Rotation Angle θ</span>
                  <span className="font-mono font-bold text-warm-accent">{rotationAngleDeg}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationAngleDeg}
                  onChange={e => setRotationAngleDeg(Number(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-warm-accent"
                />
              </div>
            )}

            {/* Mathematical explanation */}
            <div className="pt-2 border-t border-border/60">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-dark-text mb-1">
                <BookOpen className="w-3.5 h-3.5 text-primary-green" />
                <span>Dirac Action</span>
              </div>
              <p className="text-xs text-muted-text font-mono bg-background p-2 rounded">
                {def.mathExplanation}
              </p>
            </div>
          </div>

          {/* Initial State Selector */}
          {def.numQubits === 1 && (
            <div className="paper-card p-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-dark-text">Initial State:</span>
              <div className="flex space-x-1.5">
                {(['0', '1', 'plus'] as const).map(key => (
                  <button
                    key={key}
                    onClick={() => setInitialStateKey(key)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      initialStateKey === key
                        ? 'bg-primary-green text-white'
                        : 'bg-surface border border-border text-muted-text hover:text-dark-text'
                    }`}
                  >
                    |{key === 'plus' ? '+' : key}⟩
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Before & After 3D Bloch Sphere Comparison (6 / 12) */}
        <div className="lg:col-span-6 paper-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-dark-text">
              Bloch Sphere Transformation
            </h4>
            <span className="text-xs text-muted-text">
              Before → After <code className="font-mono text-primary-green">{def.symbol}</code>
            </span>
          </div>

          {def.numQubits === 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-muted-text mb-1">Input |Ψ_in⟩</span>
                <div className="bg-background rounded p-2 border border-border/60">
                  <BlochSphere3D theta={inBv.theta} phi={inBv.phi} size={200} interactive={false} />
                </div>
                <span className="font-mono text-xs text-dark-text mt-1">
                  z = {inBv.z.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-primary-green mb-1">Output U|Ψ_in⟩</span>
                <div className="bg-background rounded p-2 border border-primary-green/40">
                  <BlochSphere3D theta={outBv.theta} phi={outBv.phi} size={200} interactive={false} />
                </div>
                <span className="font-mono text-xs text-dark-text mt-1">
                  z = {outBv.z.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-background rounded-lg border border-border/60">
              <Sparkles className="w-8 h-8 text-warm-accent mx-auto mb-2" />
              <h5 className="text-sm font-bold text-dark-text mb-1">
                Multi-Qubit Entangling Operator
              </h5>
              <p className="text-xs text-muted-text max-w-sm mx-auto">
                {def.name} operates across {def.numQubits} qubits and cannot be represented on a single independent Bloch sphere. Use the Multi-Qubit Simulator to inspect its entanglement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
