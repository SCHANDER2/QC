import { ComplexNumber } from './complex';
import { GateDefinition, GateType } from '../types/quantum';

const SQRT1_2 = Math.SQRT1_2; // 1 / sqrt(2)

export type Matrix2x2 = [
  [ComplexNumber, ComplexNumber],
  [ComplexNumber, ComplexNumber]
];

export function getGateMatrix2x2(gate: GateType, params?: number[]): Matrix2x2 {
  const theta = params && params.length > 0 ? params[0] : 0;

  switch (gate) {
    case 'I':
      return [
        [ComplexNumber.one(), ComplexNumber.zero()],
        [ComplexNumber.zero(), ComplexNumber.one()],
      ];

    case 'X':
      return [
        [ComplexNumber.zero(), ComplexNumber.one()],
        [ComplexNumber.one(), ComplexNumber.zero()],
      ];

    case 'Y':
      return [
        [ComplexNumber.zero(), new ComplexNumber(0, -1)],
        [new ComplexNumber(0, 1), ComplexNumber.zero()],
      ];

    case 'Z':
      return [
        [ComplexNumber.one(), ComplexNumber.zero()],
        [ComplexNumber.zero(), new ComplexNumber(-1, 0)],
      ];

    case 'H':
      return [
        [new ComplexNumber(SQRT1_2, 0), new ComplexNumber(SQRT1_2, 0)],
        [new ComplexNumber(SQRT1_2, 0), new ComplexNumber(-SQRT1_2, 0)],
      ];

    case 'S':
      return [
        [ComplexNumber.one(), ComplexNumber.zero()],
        [ComplexNumber.zero(), new ComplexNumber(0, 1)],
      ];

    case 'Sdg':
      return [
        [ComplexNumber.one(), ComplexNumber.zero()],
        [ComplexNumber.zero(), new ComplexNumber(0, -1)],
      ];

    case 'T':
      return [
        [ComplexNumber.one(), ComplexNumber.zero()],
        [ComplexNumber.zero(), new ComplexNumber(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))],
      ];

    case 'Tdg':
      return [
        [ComplexNumber.one(), ComplexNumber.zero()],
        [ComplexNumber.zero(), new ComplexNumber(Math.cos(-Math.PI / 4), Math.sin(-Math.PI / 4))],
      ];

    case 'SqrtX':
      // 0.5 * [[1+i, 1-i], [1-i, 1+i]]
      return [
        [new ComplexNumber(0.5, 0.5), new ComplexNumber(0.5, -0.5)],
        [new ComplexNumber(0.5, -0.5), new ComplexNumber(0.5, 0.5)],
      ];

    case 'SqrtY':
      // 0.5 * [[1+i, -1-i], [1+i, 1+i]]
      return [
        [new ComplexNumber(0.5, 0.5), new ComplexNumber(-0.5, -0.5)],
        [new ComplexNumber(0.5, 0.5), new ComplexNumber(0.5, 0.5)],
      ];

    case 'Rx': {
      // Rx(θ) = cos(θ/2) I - i sin(θ/2) X = [[cos(θ/2), -i sin(θ/2)], [-i sin(θ/2), cos(θ/2)]]
      const half = theta / 2;
      const c = Math.cos(half);
      const s = Math.sin(half);
      return [
        [new ComplexNumber(c, 0), new ComplexNumber(0, -s)],
        [new ComplexNumber(0, -s), new ComplexNumber(c, 0)],
      ];
    }

    case 'Ry': {
      // Ry(θ) = [[cos(θ/2), -sin(θ/2)], [sin(θ/2), cos(θ/2)]]
      const half = theta / 2;
      const c = Math.cos(half);
      const s = Math.sin(half);
      return [
        [new ComplexNumber(c, 0), new ComplexNumber(-s, 0)],
        [new ComplexNumber(s, 0), new ComplexNumber(c, 0)],
      ];
    }

    case 'Rz': {
      // Rz(θ) = [[exp(-i θ/2), 0], [0, exp(i θ/2)]]
      const half = theta / 2;
      return [
        [new ComplexNumber(Math.cos(-half), Math.sin(-half)), ComplexNumber.zero()],
        [ComplexNumber.zero(), new ComplexNumber(Math.cos(half), Math.sin(half))],
      ];
    }

    case 'Phase': {
      // Phase(λ) = [[1, 0], [0, exp(iλ)]]
      return [
        [ComplexNumber.one(), ComplexNumber.zero()],
        [ComplexNumber.zero(), new ComplexNumber(Math.cos(theta), Math.sin(theta))],
      ];
    }

    default:
      return [
        [ComplexNumber.one(), ComplexNumber.zero()],
        [ComplexNumber.zero(), ComplexNumber.one()],
      ];
  }
}

export const GATE_DEFINITIONS: Record<GateType, GateDefinition> = {
  I: {
    id: 'I',
    name: 'Identity',
    symbol: 'I',
    description: 'Leaves the qubit state unchanged.',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The Identity gate leaves the state unchanged.',
    mathExplanation: 'I |0⟩ = |0⟩, I |1⟩ = |1⟩. Matrix: [[1, 0], [0, 1]].',
  },
  X: {
    id: 'X',
    name: 'Pauli-X',
    symbol: 'X',
    description: 'Bit-flip gate. Swaps |0⟩ and |1⟩; 180° rotation around X-axis.',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The X gate flips |0⟩ to |1⟩ and |1⟩ to |0⟩ (quantum NOT).',
    mathExplanation: 'X |0⟩ = |1⟩, X |1⟩ = |0⟩. Matrix: [[0, 1], [1, 0]].',
  },
  Y: {
    id: 'Y',
    name: 'Pauli-Y',
    symbol: 'Y',
    description: 'Bit and phase flip. 180° rotation around Y-axis.',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The Y gate flips the bit and adds a π/2 phase shift.',
    mathExplanation: 'Y |0⟩ = i|1⟩, Y |1⟩ = -i|0⟩. Matrix: [[0, -i], [i, 0]].',
  },
  Z: {
    id: 'Z',
    name: 'Pauli-Z',
    symbol: 'Z',
    description: 'Phase-flip gate. Inverts the phase of |1⟩; 180° rotation around Z-axis.',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The Z gate flips the phase of |1⟩ to -|1⟩ while leaving |0⟩ unchanged.',
    mathExplanation: 'Z |0⟩ = |0⟩, Z |1⟩ = -|1⟩. Matrix: [[1, 0], [0, -1]].',
  },
  H: {
    id: 'H',
    name: 'Hadamard',
    symbol: 'H',
    description: 'Creates equal superposition from computational basis states.',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The Hadamard gate creates an equal superposition of |0⟩ and |1⟩.',
    mathExplanation: 'H |0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩; H |1⟩ = (|0⟩ - |1⟩)/√2 = |-⟩. Matrix: 1/√2 [[1, 1], [1, -1]].',
  },
  S: {
    id: 'S',
    name: 'Phase (S)',
    symbol: 'S',
    description: 'Quarter-turn phase gate (90° around Z-axis). S = √Z.',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The S gate multiplies the |1⟩ amplitude by i (90° phase shift).',
    mathExplanation: 'S |0⟩ = |0⟩, S |1⟩ = i|1⟩. Matrix: [[1, 0], [0, i]]. S² = Z.',
  },
  Sdg: {
    id: 'Sdg',
    name: 'S-Dagger',
    symbol: 'S†',
    description: 'Adjoint of S gate (-90° around Z-axis).',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The S† gate applies a -90° phase shift to |1⟩.',
    mathExplanation: 'S† |0⟩ = |0⟩, S† |1⟩ = -i|1⟩. Matrix: [[1, 0], [0, -i]].',
  },
  T: {
    id: 'T',
    name: 'T Gate',
    symbol: 'T',
    description: 'Eighth-turn phase gate (45° around Z-axis). T = √S.',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The T gate adds a 45° (π/4) phase shift to |1⟩.',
    mathExplanation: 'T |0⟩ = |0⟩, T |1⟩ = exp(iπ/4)|1⟩. T⁴ = Z, T⁸ = I.',
  },
  Tdg: {
    id: 'Tdg',
    name: 'T-Dagger',
    symbol: 'T†',
    description: 'Adjoint of T gate (-45° around Z-axis).',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The T† gate applies a -45° phase shift to |1⟩.',
    mathExplanation: 'T† |0⟩ = |0⟩, T† |1⟩ = exp(-iπ/4)|1⟩.',
  },
  SqrtX: {
    id: 'SqrtX',
    name: 'Square Root of X',
    symbol: '√X',
    description: 'Applies half of a bit flip (90° rotation around X). (√X)² = X.',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The √X gate applies half of a Pauli-X operation.',
    mathExplanation: '(√X)² = X. Matrix: 1/2 [[1+i, 1-i], [1-i, 1+i]].',
  },
  SqrtY: {
    id: 'SqrtY',
    name: 'Square Root of Y',
    symbol: '√Y',
    description: 'Applies half of a Pauli-Y rotation (90° around Y). (√Y)² = Y.',
    category: 'single',
    numQubits: 1,
    numControls: 0,
    isParameterized: false,
    explanation: 'The √Y gate rotates the state by 90° around the Y-axis.',
    mathExplanation: '(√Y)² = Y. Matrix: 1/2 [[1+i, -1-i], [1+i, 1+i]].',
  },
  Rx: {
    id: 'Rx',
    name: 'Rotation X',
    symbol: 'Rx',
    description: 'Continuous rotation around the X-axis by angle θ.',
    category: 'rotation',
    numQubits: 1,
    numControls: 0,
    isParameterized: true,
    defaultParams: [Math.PI / 2],
    explanation: 'Rotates the state vector around the Bloch X-axis by angle θ.',
    mathExplanation: 'Rx(θ) = cos(θ/2) I - i sin(θ/2) X.',
  },
  Ry: {
    id: 'Ry',
    name: 'Rotation Y',
    symbol: 'Ry',
    description: 'Continuous rotation around the Y-axis by angle θ.',
    category: 'rotation',
    numQubits: 1,
    numControls: 0,
    isParameterized: true,
    defaultParams: [Math.PI / 2],
    explanation: 'Rotates the state vector around the Bloch Y-axis by angle θ.',
    mathExplanation: 'Ry(θ) = cos(θ/2) I - i sin(θ/2) Y.',
  },
  Rz: {
    id: 'Rz',
    name: 'Rotation Z',
    symbol: 'Rz',
    description: 'Continuous rotation around the Z-axis by angle θ.',
    category: 'rotation',
    numQubits: 1,
    numControls: 0,
    isParameterized: true,
    defaultParams: [Math.PI / 2],
    explanation: 'Rotates the state vector around the Bloch Z-axis by angle θ.',
    mathExplanation: 'Rz(θ) = exp(-i θ Z / 2).',
  },
  Phase: {
    id: 'Phase',
    name: 'Phase Shift',
    symbol: 'P(λ)',
    description: 'Applies arbitrary relative phase λ to |1⟩.',
    category: 'rotation',
    numQubits: 1,
    numControls: 0,
    isParameterized: true,
    defaultParams: [Math.PI / 2],
    explanation: 'Multiplies state |1⟩ by exp(iλ) without changing |0⟩.',
    mathExplanation: 'P(λ) |0⟩ = |0⟩, P(λ) |1⟩ = exp(iλ)|1⟩.',
  },
  CX: {
    id: 'CX',
    name: 'Controlled-NOT',
    symbol: 'CNOT',
    description: 'Flips the target qubit if and only if the control qubit is |1⟩.',
    category: 'controlled',
    numQubits: 2,
    numControls: 1,
    isParameterized: false,
    explanation: 'Flips target qubit when control is |1⟩. Generates entanglement.',
    mathExplanation: 'CNOT |c, t⟩ = |c, t ⊕ c⟩. Bell state creator: CNOT(H ⊗ I)|00⟩ = (|00⟩+|11⟩)/√2.',
  },
  CZ: {
    id: 'CZ',
    name: 'Controlled-Z',
    symbol: 'CZ',
    description: 'Inverts phase of |11⟩; symmetric between control and target.',
    category: 'controlled',
    numQubits: 2,
    numControls: 1,
    isParameterized: false,
    explanation: 'Applies a π phase shift only if both qubits are |1⟩.',
    mathExplanation: 'CZ |11⟩ = -|11⟩; CZ leaves |00⟩, |01⟩, |10⟩ unchanged.',
  },
  SWAP: {
    id: 'SWAP',
    name: 'SWAP Gate',
    symbol: 'SWAP',
    description: 'Exchanges the states of two qubits.',
    category: 'multi',
    numQubits: 2,
    numControls: 0,
    isParameterized: false,
    explanation: 'Exchanges the quantum information between two qubits.',
    mathExplanation: 'SWAP |a, b⟩ = |b, a⟩. Equivalent to 3 alternating CNOTs.',
  },
  CCX: {
    id: 'CCX',
    name: 'Toffoli (CCNOT)',
    symbol: 'CCX',
    description: 'Flips the target qubit if both control qubits are |1⟩.',
    category: 'multi',
    numQubits: 3,
    numControls: 2,
    isParameterized: false,
    explanation: 'Quantum AND gate: flips target only when both controls are |1⟩.',
    mathExplanation: 'CCX |c1, c2, t⟩ = |c1, c2, t ⊕ (c1 · c2)⟩.',
  },
  CSWAP: {
    id: 'CSWAP',
    name: 'Fredkin (CSWAP)',
    symbol: 'CSWAP',
    description: 'Swaps targets if and only if the control qubit is |1⟩.',
    category: 'multi',
    numQubits: 3,
    numControls: 1,
    isParameterized: false,
    explanation: 'Controlled swap: exchanges two qubits only when control is |1⟩.',
    mathExplanation: 'CSWAP |1, a, b⟩ = |1, b, a⟩; CSWAP |0, a, b⟩ = |0, a, b⟩.',
  },
};
