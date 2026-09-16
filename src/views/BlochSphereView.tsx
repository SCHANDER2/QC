import React, { useState } from 'react';
import { BlochSphere3D } from '../components/visualization/BlochSphere3D';
import { DensityMatrixUtils } from '../quantum/density';
import { QuantumEngine } from '../quantum/engine';
import { GateType } from '../types/quantum';
import { RotateCcw, Copy, Check, MousePointer, ArrowRight } from 'lucide-react';

interface BlochSphereViewProps {
  onNavigateToConcepts?: () => void;
}

export const BlochSphereView: React.FC<BlochSphereViewProps> = ({ onNavigateToConcepts }) => {
  // Canonical single-qubit state maintained in angles (theta, phi)
  const [thetaDeg, setThetaDeg] = useState<number>(60);
  const [phiDeg, setPhiDeg] = useState<number>(45);
  const [activeTab, setActiveTab] = useState<'angles' | 'vector'>('angles');
  const [copied, setCopied] = useState(false);

  // Convert to radians for simulation math
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const phiRad = (phiDeg * Math.PI) / 180;

  // Single source of truth: compute QuantumState
  const currentState = DensityMatrixUtils.stateFromAngles(thetaRad, phiRad);
  const blochVec = DensityMatrixUtils.getBlochVector(currentState, 0);

  // Coordinates
  const x = blochVec.x;
  const y = blochVec.y;
  const z = blochVec.z;

  // Amplitudes for Dirac notation
  const alpha = currentState.statevector[0];
  const beta = currentState.statevector[1];

  const stateString = `|ψ⟩ = ${alpha.toString(3)}|0⟩ + ${beta.toString(3)}|1⟩`;

  const handleCopyState = () => {
    navigator.clipboard.writeText(stateString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyGate = (gate: GateType) => {
    // True mathematical gate application
    const newState = QuantumEngine.applyOperation(currentState, {
      id: `gate_${Date.now()}`,
      gate,
      targets: [0],
    });
    const newBv = DensityMatrixUtils.getBlochVector(newState, 0);
    setThetaDeg(Math.round((newBv.theta * 180) / Math.PI));
    setPhiDeg(Math.round((newBv.phi * 180) / Math.PI));
  };

  const handlePreset = (t: number, p: number) => {
    setThetaDeg(t);
    setPhiDeg(p);
  };

  const handleReset = () => {
    setThetaDeg(0);
    setPhiDeg(0);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quote Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-muted-text uppercase block mb-1">
            Interactive Visualization
          </span>
          <h1 className="text-3xl font-bold text-dark-text tracking-tight font-serif mb-2">
            Bloch Sphere
          </h1>
          <p className="text-xs text-muted-text max-w-2xl leading-relaxed">
            A qubit can be in a superposition of |0⟩ and |1⟩. Use the controls below to rotate, explore, and see how its state changes on the Bloch sphere.
          </p>
        </div>

        {/* Academic Quote Card */}
        <div className="paper-card bg-soft-green/60 border-[#C3D7CA] p-4 max-w-md flex-shrink-0">
          <div className="flex items-start space-x-3">
            <span className="text-2xl font-serif text-primary-green leading-none">“</span>
            <div>
              <p className="text-xs font-serif italic text-dark-text leading-relaxed">
                A qubit is a superposition of |0⟩ and |1⟩.
              </p>
              <span className="text-[10px] text-muted-text uppercase tracking-wider block mt-1">
                — Quantum Computing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout Matching Reference Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Set the State (3.5 / 12) */}
        <div className="lg:col-span-4 paper-card p-4 space-y-4">
          <h3 className="text-sm font-bold text-dark-text uppercase tracking-wide">
            Set the State
          </h3>

          {/* Toggle Tabs */}
          <div className="flex rounded-lg bg-background p-1 border border-border">
            <button
              onClick={() => setActiveTab('angles')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'angles'
                  ? 'bg-primary-green text-white shadow-xs'
                  : 'text-muted-text hover:text-dark-text'
              }`}
            >
              Angles (θ, φ)
            </button>
            <button
              onClick={() => setActiveTab('vector')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'vector'
                  ? 'bg-primary-green text-white shadow-xs'
                  : 'text-muted-text hover:text-dark-text'
              }`}
            >
              State Vector
            </button>
          </div>

          {/* Theta Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-dark-text block">θ (theta)</label>
                <span className="text-[11px] text-muted-text">Angle from +Z axis</span>
              </div>
              <div className="px-2.5 py-1 bg-background border border-border rounded font-mono text-xs font-bold text-dark-text">
                {thetaDeg}°
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              value={thetaDeg}
              onChange={e => setThetaDeg(Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary-green"
            />
            <div className="flex justify-between text-[10px] text-muted-text font-mono">
              <span>0° (|0⟩)</span>
              <span>180° (|1⟩)</span>
            </div>
          </div>

          {/* Phi Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-dark-text block">φ (phi)</label>
                <span className="text-[11px] text-muted-text">Angle in X-Y plane</span>
              </div>
              <div className="px-2.5 py-1 bg-background border border-border rounded font-mono text-xs font-bold text-dark-text">
                {phiDeg}°
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={phiDeg}
              onChange={e => setPhiDeg(Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-warm-accent"
            />
            <div className="flex justify-between text-[10px] text-muted-text font-mono">
              <span>0° (+X)</span>
              <span>360°</span>
            </div>
          </div>

          {/* State Vector Display Box */}
          <div className="p-3 bg-background rounded-lg border border-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-text">
                State Vector <span className="font-normal">(auto-updated)</span>
              </span>
              <button
                onClick={handleCopyState}
                className="p-1 text-muted-text hover:text-dark-text transition-colors"
                title="Copy Dirac state formula"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-primary-green" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="font-mono text-xs font-bold text-dark-text overflow-x-auto py-1">
              {stateString}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-primary-green hover:bg-primary-green-hover text-white transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset State to |0⟩</span>
          </button>
        </div>

        {/* Center Column: 3D Bloch Sphere Canvas (5 / 12) */}
        <div className="lg:col-span-5 paper-card p-4 flex flex-col items-center justify-center relative min-h-[420px]">
          <BlochSphere3D
            theta={thetaRad}
            phi={phiRad}
            r={1.0}
            size={360}
            interactive={true}
          />

          <div className="flex items-center space-x-2 text-xs text-muted-text mt-2 select-none">
            <MousePointer className="w-3.5 h-3.5 text-primary-green" />
            <span>Click and drag to rotate • Scroll to zoom</span>
          </div>
        </div>

        {/* Right Column: State Info & Quick Gates & Presets (3.5 / 12) */}
        <div className="lg:col-span-3 space-y-4">
          {/* State Information */}
          <div className="paper-card p-3 space-y-2">
            <h4 className="text-xs font-bold text-dark-text uppercase tracking-wider">
              State Information
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-background p-2 rounded">
                <span className="text-muted-text text-[10px] block">θ</span>
                <span className="font-bold text-dark-text">{thetaDeg}°</span>
              </div>
              <div className="bg-background p-2 rounded">
                <span className="text-muted-text text-[10px] block">φ</span>
                <span className="font-bold text-dark-text">{phiDeg}°</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <span className="text-[10px] font-semibold text-muted-text uppercase block mb-1">
                Bloch Coordinates
              </span>
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-text">x:</span>
                  <span className="font-semibold text-dark-text">{x.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">y:</span>
                  <span className="font-semibold text-dark-text">{y.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">z:</span>
                  <span className="font-semibold text-dark-text">{z.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Try Some Quantum Gates */}
          <div className="paper-card p-3 space-y-2">
            <div>
              <h4 className="text-xs font-bold text-dark-text uppercase tracking-wider">
                Try Some Quantum Gates
              </h4>
              <p className="text-[11px] text-muted-text">
                See how quantum gates rotate the state on the sphere.
              </p>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => handleApplyGate('X')}
                className="py-2 rounded bg-[#FBEAE5] hover:bg-[#F6D5CC] border border-[#E8C5BC] font-mono text-xs font-bold text-[#8C3A21] transition-colors"
                title="X: Bit-flip 180° around X"
              >
                X
              </button>
              <button
                onClick={() => handleApplyGate('Y')}
                className="py-2 rounded bg-[#FDF3E5] hover:bg-[#F9E4C5] border border-[#EBD0B0] font-mono text-xs font-bold text-[#784A12] transition-colors"
                title="Y: Bit and phase flip 180° around Y"
              >
                Y
              </button>
              <button
                onClick={() => handleApplyGate('Z')}
                className="py-2 rounded bg-[#EBF1F5] hover:bg-[#D5E4ED] border border-[#C2D4DF] font-mono text-xs font-bold text-[#24526E] transition-colors"
                title="Z: Phase-flip 180° around Z"
              >
                Z
              </button>
              <button
                onClick={() => handleApplyGate('H')}
                className="py-2 rounded bg-soft-green hover:bg-[#D3E3D7] border border-[#C3D7CA] font-mono text-xs font-bold text-primary-green transition-colors"
                title="H: Hadamard superposition"
              >
                H
              </button>
            </div>
          </div>

          {/* Common States */}
          <div className="paper-card p-3 space-y-2">
            <h4 className="text-xs font-bold text-dark-text uppercase tracking-wider">
              Common States
            </h4>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <button
                onClick={() => handlePreset(0, 0)}
                className="p-1.5 rounded border border-border bg-surface hover:border-primary-green transition-all"
                title="|0⟩ Ground state"
              >
                <span className="text-xs font-bold block text-dark-text">↑ |0⟩</span>
                <span className="text-[9px] text-muted-text block">(0°, 0°)</span>
              </button>

              <button
                onClick={() => handlePreset(180, 0)}
                className="p-1.5 rounded border border-border bg-surface hover:border-primary-green transition-all"
                title="|1⟩ Excited state"
              >
                <span className="text-xs font-bold block text-dark-text">↓ |1⟩</span>
                <span className="text-[9px] text-muted-text block">(180°, 0°)</span>
              </button>

              <button
                onClick={() => handlePreset(90, 0)}
                className="p-1.5 rounded border border-border bg-surface hover:border-primary-green transition-all"
                title="|+⟩ Superposition state"
              >
                <span className="text-xs font-bold block text-dark-text">→ |+⟩</span>
                <span className="text-[9px] text-muted-text block">(90°, 0°)</span>
              </button>

              <button
                onClick={() => handlePreset(90, 90)}
                className="p-1.5 rounded border border-border bg-surface hover:border-primary-green transition-all"
                title="|+i⟩ Circular phase state"
              >
                <span className="text-xs font-bold block text-dark-text">↗ |+i⟩</span>
                <span className="text-[9px] text-muted-text block">(90°, 90°)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Educational Banner Matching Screenshot */}
      <div className="paper-card p-4 bg-background border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#FDF3E5] border border-[#EBD0B0] flex items-center justify-center text-warm-accent flex-shrink-0 mt-0.5">
            💡
          </div>
          <div>
            <h4 className="text-xs font-bold text-dark-text">What’s happening?</h4>
            <p className="text-xs text-muted-text leading-relaxed">
              Moving θ changes the height (superposition amount) and φ rotates the state in the X–Y plane. Every point on the sphere surface represents a valid normalized pure qubit state.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToConcepts}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-soft-green text-primary-green hover:bg-[#D3E3D7] font-semibold text-xs transition-colors flex-shrink-0"
        >
          <span>Learn more about the Bloch Sphere</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
