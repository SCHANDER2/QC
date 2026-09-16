/**
 * QuantumLearn - Core Data Models and Type Definitions
 * 
 * Basis Convention:
 * |q0 q1 ... q(n-1)>
 * q0 is the leftmost / most-significant displayed qubit.
 * For 2 qubits:
 * |00> = index 0
 * |01> = index 1
 * |10> = index 2
 * |11> = index 3
 */

export interface IComplexNumber {
  real: number;
  imag: number;
}

export type GateType =
  | 'I'
  | 'X'
  | 'Y'
  | 'Z'
  | 'H'
  | 'S'
  | 'Sdg'
  | 'T'
  | 'Tdg'
  | 'SqrtX'
  | 'SqrtY'
  | 'Rx'
  | 'Ry'
  | 'Rz'
  | 'Phase'
  | 'CX'
  | 'CZ'
  | 'SWAP'
  | 'CCX' // Toffoli
  | 'CSWAP'; // Fredkin

export interface GateDefinition {
  id: GateType;
  name: string;
  symbol: string;
  description: string;
  category: 'single' | 'rotation' | 'controlled' | 'multi';
  numQubits: number;
  numControls: number;
  isParameterized: boolean;
  defaultParams?: number[];
  matrix2x2?: [
    [IComplexNumber, IComplexNumber],
    [IComplexNumber, IComplexNumber]
  ];
  explanation: string;
  mathExplanation: string;
}

export interface GateOperation {
  id: string; // unique instance id
  gate: GateType;
  targets: number[]; // target qubit indices (0 to n-1)
  controls?: number[]; // control qubit indices
  params?: number[]; // e.g. angle theta in radians
}

export interface CircuitStep {
  stepIndex: number;
  operations: GateOperation[];
}

export interface Circuit {
  numQubits: number;
  steps: CircuitStep[];
}

export interface BlochVector {
  qubitIndex: number;
  x: number;
  y: number;
  z: number;
  r: number; // radius <= 1 (r < 1 indicates a mixed reduced state)
  theta: number; // polar angle [0, pi]
  phi: number; // azimuth angle [0, 2*pi)
  purity: number; // Tr(rho^2) = (1 + r^2)/2
}

export interface DensityMatrix2x2 {
  rho00: IComplexNumber;
  rho01: IComplexNumber;
  rho10: IComplexNumber;
  rho11: IComplexNumber;
}

export interface AmplitudeItem {
  index: number;
  basis: string; // e.g. "|00>"
  amplitude: IComplexNumber;
  probability: number; // |amplitude|^2 in [0, 1]
  phaseRad: number; // [-pi, pi]
  phaseDeg: number; // [0, 360)
}

export interface MeasurementResult {
  basisOutcome: string;
  indexOutcome: number;
  probabilities: number[];
  shots?: { [basis: string]: number };
  totalShots?: number;
  timestamp: number;
}

export interface SimulationSnapshot {
  step: number;
  gateDescription?: string;
  statevector: IComplexNumber[];
  probabilities: number[];
  blochVectors: BlochVector[];
  explanation: string;
  mathNotes?: string;
}

export type ExecutionMode = 'PLAY' | 'STEP' | 'PAUSE' | 'RESET' | 'STEP_BACK';

export interface Concept {
  id: string;
  title: string;
  category: string;
  summary: string;
  plainText: string;
  mathExplanation: string;
  interactivePreset?: {
    numQubits: number;
    gates: GateOperation[];
  };
  keyTakeaways: string[];
}

export interface ProblemOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  prompt: string;
  options: ProblemOption[];
  hint: string;
  initialCircuit?: {
    numQubits: number;
    gates: GateOperation[];
  };
  verification?: {
    type: 'state' | 'probability' | 'gate';
    targetState?: string;
    targetProbability?: { basis: string; min: number; max: number };
  };
}
