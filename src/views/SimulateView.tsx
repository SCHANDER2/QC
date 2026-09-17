import React, { useState, useEffect, useRef } from 'react';
import { QuantumCircuit } from '../quantum/circuit';
import { CircuitGrid } from '../components/circuit/CircuitGrid';
import { CircuitControls } from '../components/circuit/CircuitControls';
import { GatePalette } from '../components/circuit/GatePalette';
import { AmplitudeTable } from '../components/simulator/AmplitudeTable';
import { MeasurementPanel } from '../components/simulator/MeasurementPanel';
import { ExplanationBanner } from '../components/simulator/ExplanationBanner';
import { MultiBlochView } from '../components/visualization/MultiBlochView';
import { QuantumMeasurement } from '../quantum/measurement';
import { PRESET_STATES } from '../quantum/presets';
import { ComplexNumber } from '../quantum/complex';
import { QasmExporter } from '../quantum/qasm';
import { GateOperation, GateType, ExecutionMode, MeasurementResult } from '../types/quantum';
import { Sliders, Cpu, Sparkles, Code2, Copy, Check, X } from 'lucide-react';

interface SimulateViewProps {
  isExplorerMode: boolean;
}

export const SimulateView: React.FC<SimulateViewProps> = ({ isExplorerMode }) => {
  const [numQubits, setNumQubits] = useState<number>(2);
  const [circuit, setCircuit] = useState<QuantumCircuit>(() => new QuantumCircuit(2));
  const [selectedGate, setSelectedGate] = useState<GateType | null>('H');
  const [selectedAngle, setSelectedAngle] = useState<number>(Math.PI / 2);
  const [execMode, setExecMode] = useState<ExecutionMode>('PAUSE');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [lastMeasurement, setLastMeasurement] = useState<MeasurementResult | null>(null);
  const [collapsedBasis, setCollapsedBasis] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportTab, setExportTab] = useState<'qasm' | 'ascii'>('qasm');
  const [copiedExport, setCopiedExport] = useState<boolean>(false);

  // Auto-play timer ref
  const playTimerRef = useRef<any>(null);

  // Compute simulation snapshots whenever circuit changes
  const snapshots = circuit.simulate();
  const totalSteps = snapshots.length - 1;

  // Active snapshot is capped at currentStepIndex
  const activeStep = Math.min(currentStepIndex, totalSteps);
  const activeSnapshot = snapshots[activeStep] || snapshots[0];

  // Save history state for undo/redo
  const pushHistory = (newCircuit: QuantumCircuit) => {
    const serialized = newCircuit.serialize();
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(serialized);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleAddOperation = (op: GateOperation, stepIndex?: number) => {
    const nextCircuit = QuantumCircuit.deserialize(circuit.serialize());
    nextCircuit.addOperation(op, stepIndex);
    setCircuit(nextCircuit);
    pushHistory(nextCircuit);
    // Move step cursor to the new step
    setCurrentStepIndex(nextCircuit.simulate().length - 1);
    setCollapsedBasis(null);
  };

  const handleRemoveOperation = (opId: string) => {
    const nextCircuit = QuantumCircuit.deserialize(circuit.serialize());
    nextCircuit.removeOperation(opId);
    setCircuit(nextCircuit);
    pushHistory(nextCircuit);
    setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
    setCollapsedBasis(null);
  };

  const handleUpdateOperation = (opId: string, updater: (op: GateOperation) => GateOperation) => {
    const nextCircuit = QuantumCircuit.deserialize(circuit.serialize());
    if (nextCircuit.updateOperation(opId, updater)) {
      setCircuit(nextCircuit);
      pushHistory(nextCircuit);
      setCollapsedBasis(null);
    }
  };

  const handleAddQubit = () => {
    if (numQubits >= 8) return;
    const nextCircuit = QuantumCircuit.deserialize(circuit.serialize());
    if (nextCircuit.addQubit()) {
      setNumQubits(nextCircuit.numQubits);
      setCircuit(nextCircuit);
      pushHistory(nextCircuit);
    }
  };

  const handleRemoveQubit = () => {
    if (numQubits <= 1) return;
    const nextCircuit = QuantumCircuit.deserialize(circuit.serialize());
    if (nextCircuit.removeQubit()) {
      setNumQubits(nextCircuit.numQubits);
      setCircuit(nextCircuit);
      pushHistory(nextCircuit);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = historyIndex - 1;
      const restored = QuantumCircuit.deserialize(history[prev]);
      setCircuit(restored);
      setNumQubits(restored.numQubits);
      setHistoryIndex(prev);
      setCurrentStepIndex(restored.simulate().length - 1);
      setCollapsedBasis(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = historyIndex + 1;
      const restored = QuantumCircuit.deserialize(history[next]);
      setCircuit(restored);
      setNumQubits(restored.numQubits);
      setHistoryIndex(next);
      setCurrentStepIndex(restored.simulate().length - 1);
      setCollapsedBasis(null);
    }
  };

  const handleClear = () => {
    const nextCircuit = new QuantumCircuit(numQubits);
    setCircuit(nextCircuit);
    pushHistory(nextCircuit);
    setCurrentStepIndex(0);
    setExecMode('PAUSE');
    setCollapsedBasis(null);
    setLastMeasurement(null);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setExecMode('PAUSE');
    setCollapsedBasis(null);
  };

  const handlePlay = () => {
    setExecMode('PLAY');
  };

  const handlePause = () => {
    setExecMode('PAUSE');
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
  };

  // Playback timer loop
  useEffect(() => {
    if (execMode === 'PLAY') {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= totalSteps) {
            setExecMode('PAUSE');
            return totalSteps;
          }
          return prev + 1;
        });
      }, 700);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [execMode, totalSteps]);

  const handleStepForward = () => {
    if (currentStepIndex < totalSteps) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_STATES.find(p => p.id === presetId);
    if (!preset) return;

    const nextCircuit = QuantumCircuit.fromOperations(preset.numQubits, preset.circuit);
    setNumQubits(preset.numQubits);
    setCircuit(nextCircuit);
    pushHistory(nextCircuit);
    setCurrentStepIndex(nextCircuit.simulate().length - 1);
    setCollapsedBasis(null);
    setLastMeasurement(null);
  };

  // Projective measurement
  const handleMeasureOneShot = () => {
    // Reconstruct state at active step
    const currentSimState = snapshots[activeStep];
    const n = numQubits;
    // Sample outcome
    const probs = currentSimState.probabilities;
    const outcomeIdx = QuantumMeasurement.sampleDistribution(probs);
    const basisStr = `|${outcomeIdx.toString(2).padStart(n, '0')}⟩`;
    setCollapsedBasis(basisStr);

    setLastMeasurement({
      basisOutcome: basisStr,
      indexOutcome: outcomeIdx,
      probabilities: probs,
      timestamp: Date.now(),
    });
  };

  const handleRunShots = (shots: number) => {
    const currentSimState = snapshots[activeStep];
    const n = numQubits;
    const probs = currentSimState.probabilities;

    const shotsCount: { [b: string]: number } = {};
    for (let i = 0; i < (1 << n); i++) {
      shotsCount[`|${i.toString(2).padStart(n, '0')}⟩`] = 0;
    }

    let lastIdx = 0;
    for (let s = 0; s < shots; s++) {
      const idx = QuantumMeasurement.sampleDistribution(probs);
      lastIdx = idx;
      const bStr = `|${idx.toString(2).padStart(n, '0')}⟩`;
      shotsCount[bStr] = (shotsCount[bStr] || 0) + 1;
    }

    setLastMeasurement({
      basisOutcome: `|${lastIdx.toString(2).padStart(n, '0')}⟩`,
      indexOutcome: lastIdx,
      probabilities: probs,
      shots: shotsCount,
      totalShots: shots,
      timestamp: Date.now(),
    });
  };

  // Statevector amplitudes for AmplitudeTable
  const currentAmplitudes = activeSnapshot.statevector.map((amp, idx) => {
    const basis = `|${idx.toString(2).padStart(numQubits, '0')}⟩`;
    const prob = activeSnapshot.probabilities[idx];
    const cAmp = ComplexNumber.from(amp);
    const phaseRad = cAmp.phase();
    const phaseDeg = Math.round(((cAmp.phasePositive() * 180) / Math.PI) * 10) / 10;
    return {
      index: idx,
      basis,
      amplitude: cAmp,
      probability: prob,
      phaseRad,
      phaseDeg,
    };
  });

  return (
    <div className="space-y-5">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold font-serif text-dark-text tracking-tight flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-primary-green" />
            <span>Multi-Qubit Simulator</span>
          </h1>
          <p className="text-xs text-muted-text">
            Exact statevector quantum simulation with real-time density matrix reduction and multi-qubit Bloch vectors.
          </p>
        </div>

        {/* Qubit Selector & Presets Dropdown */}
        <div className="flex items-center space-x-2">
          {/* Qubit Count */}
          <div className="flex items-center space-x-1 bg-surface border border-border px-2.5 py-1.5 rounded-lg text-xs">
            <Sliders className="w-3.5 h-3.5 text-primary-green" />
            <span className="text-muted-text">Qubits:</span>
            <select
              value={numQubits}
              onChange={e => {
                const count = Number(e.target.value);
                const nextCircuit = new QuantumCircuit(count);
                setNumQubits(count);
                setCircuit(nextCircuit);
                pushHistory(nextCircuit);
                setCurrentStepIndex(0);
              }}
              className="bg-transparent font-bold text-dark-text focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Qubit' : 'Qubits'} (2^{n} = {1 << n})
                </option>
              ))}
            </select>
          </div>

          {/* Preset Circuits Selector */}
          <div className="flex items-center space-x-1 bg-surface border border-border px-2.5 py-1.5 rounded-lg text-xs">
            <Sparkles className="w-3.5 h-3.5 text-warm-accent" />
            <span className="text-muted-text">Preset:</span>
            <select
              onChange={e => e.target.value && handleLoadPreset(e.target.value)}
              defaultValue=""
              className="bg-transparent font-medium text-dark-text focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="" disabled>
                Choose Preset...
              </option>
              <optgroup label="Bell States (2 Qubits)">
                <option value="bell_phi_plus">|Φ⁺⟩ Bell State</option>
                <option value="bell_phi_minus">|Φ⁻⟩ Bell State</option>
                <option value="bell_psi_plus">|Ψ⁺⟩ Bell State</option>
                <option value="bell_psi_minus">|Ψ⁻⟩ Singlet</option>
              </optgroup>
              <optgroup label="Multi-Qubit Algorithms">
                <option value="ghz_3">3-Qubit GHZ State</option>
                <option value="teleportation_circuit">Quantum Teleportation</option>
                <option value="superdense_coding">Superdense Coding</option>
                <option value="qft_3">3-Qubit QFT</option>
              </optgroup>
              <optgroup label="Single-Qubit States">
                <option value="single_plus">|+⟩ Superposition</option>
                <option value="single_plus_i">|+i⟩ Y-Plus State</option>
                <option value="single_minus">|−⟩ Negative Phase</option>
              </optgroup>
            </select>
          </div>

          {/* Export QASM / ASCII Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-soft-green hover:border-primary-green text-xs font-semibold text-dark-text transition-colors"
            title="Export OpenQASM 2.0 or ASCII Circuit Diagram"
          >
            <Code2 className="w-3.5 h-3.5 text-primary-green" />
            <span>Export QASM</span>
          </button>
        </div>
      </div>

      {/* Main Simulator 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left & Center: Circuit Editor & Timeline & Visualizations (7.5 / 12) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Circuit Editor Grid */}
          <CircuitGrid
            numQubits={numQubits}
            steps={circuit.steps}
            currentStepIndex={activeStep}
            selectedGateType={selectedGate}
            selectedAngle={selectedAngle}
            onAddOperation={handleAddOperation}
            onRemoveOperation={handleRemoveOperation}
            onUpdateOperation={handleUpdateOperation}
            onAddQubit={handleAddQubit}
            onRemoveQubit={handleRemoveQubit}
            onStepClick={stepIdx => setCurrentStepIndex(stepIdx)}
          />

          {/* Timeline & Execution Controls */}
          <CircuitControls
            mode={execMode}
            currentStep={activeStep}
            totalSteps={totalSteps}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onPlay={handlePlay}
            onPause={handlePause}
            onStepForward={handleStepForward}
            onStepBack={handleStepBack}
            onReset={handleReset}
            onClear={handleClear}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />

          {/* Multi-Qubit Bloch Spheres */}
          <MultiBlochView blochVectors={activeSnapshot.blochVectors} />

          {/* Educational Explanation Banner */}
          <ExplanationBanner
            headline={activeSnapshot.gateDescription || 'Quantum State Evolution'}
            explanation={activeSnapshot.explanation}
            mathNotes={activeSnapshot.mathNotes}
          />
        </div>

        {/* Right Column: Gate Palette, Amplitudes & Measurement (4 / 12) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Gate Selection Palette */}
          <GatePalette
            selectedGate={selectedGate}
            onSelectGate={g => setSelectedGate(g)}
            isExplorerMode={isExplorerMode}
            selectedAngle={selectedAngle}
            onSelectAngle={setSelectedAngle}
          />

          {/* State Amplitudes & Probability Table */}
          <AmplitudeTable
            amplitudes={currentAmplitudes}
            isExplorerMode={isExplorerMode}
          />

          {/* Quantum Measurement Panel */}
          <MeasurementPanel
            onMeasureOneShot={handleMeasureOneShot}
            onRunShots={handleRunShots}
            lastResult={lastMeasurement}
            collapsedBasis={collapsedBasis}
          />
        </div>
      </div>

      {/* Export QASM & ASCII Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-dark-text/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
          <div className="paper-card p-5 max-w-2xl w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-primary-green" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-dark-text">
                  Export Circuit Code & Diagram
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded text-muted-text hover:text-dark-text hover:bg-background"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Tabs */}
            <div className="flex rounded-lg bg-background p-1 border border-border w-fit">
              <button
                onClick={() => setExportTab('qasm')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  exportTab === 'qasm'
                    ? 'bg-primary-green text-white shadow-xs'
                    : 'text-muted-text hover:text-dark-text'
                }`}
              >
                OpenQASM 2.0 (IBM Qiskit)
              </button>
              <button
                onClick={() => setExportTab('ascii')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  exportTab === 'ascii'
                    ? 'bg-primary-green text-white shadow-xs'
                    : 'text-muted-text hover:text-dark-text'
                }`}
              >
                ASCII Diagram
              </button>
            </div>

            {/* Code Display Area */}
            <div className="relative bg-background rounded-lg border border-border p-3 font-mono text-xs text-dark-text max-h-72 overflow-y-auto">
              <pre className="whitespace-pre-wrap">
                {exportTab === 'qasm'
                  ? QasmExporter.toOpenQASM(numQubits, circuit.getAllOperations())
                  : QasmExporter.toAsciiDiagram(numQubits, circuit.getAllOperations())}
              </pre>
              <button
                onClick={() => {
                  const text =
                    exportTab === 'qasm'
                      ? QasmExporter.toOpenQASM(numQubits, circuit.getAllOperations())
                      : QasmExporter.toAsciiDiagram(numQubits, circuit.getAllOperations());
                  navigator.clipboard.writeText(text);
                  setCopiedExport(true);
                  setTimeout(() => setCopiedExport(false), 2000);
                }}
                className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-surface border border-border rounded text-[11px] font-medium flex items-center space-x-1 hover:border-primary-green transition-colors"
              >
                {copiedExport ? (
                  <>
                    <Check className="w-3 h-3 text-primary-green" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-muted-text">
              {exportTab === 'qasm'
                ? 'Standard OpenQASM 2.0 syntax ready to paste into IBM Quantum Composer, Aer simulator, or Qiskit Python scripts.'
                : 'Monospaced ASCII text diagram suitable for papers, lecture notes, and professor reports.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
