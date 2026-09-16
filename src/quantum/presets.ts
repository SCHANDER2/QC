import { GateOperation } from '../types/quantum';

export interface StatePreset {
  id: string;
  name: string;
  description: string;
  numQubits: number;
  circuit: GateOperation[];
  latexFormula: string;
}

export const PRESET_STATES: StatePreset[] = [
  // 1-Qubit Presets
  {
    id: 'single_zero',
    name: '|0⟩ (Ground)',
    description: 'The standard computational ground state. Points to North Pole (+Z).',
    numQubits: 1,
    circuit: [],
    latexFormula: '|0⟩',
  },
  {
    id: 'single_one',
    name: '|1⟩ (Excited)',
    description: 'Created by applying Pauli-X to |0⟩. Points to South Pole (-Z).',
    numQubits: 1,
    circuit: [{ id: 'x0', gate: 'X', targets: [0] }],
    latexFormula: '|1⟩',
  },
  {
    id: 'single_plus',
    name: '|+⟩ (Superposition)',
    description: 'Equal superposition (|0⟩ + |1⟩)/√2 created by Hadamard. Points to +X.',
    numQubits: 1,
    circuit: [{ id: 'h0', gate: 'H', targets: [0] }],
    latexFormula: '(|0⟩ + |1⟩)/√2',
  },
  {
    id: 'single_minus',
    name: '|−⟩ (Negative Phase)',
    description: 'Superposition with π phase difference (|0⟩ - |1⟩)/√2. Points to -X.',
    numQubits: 1,
    circuit: [
      { id: 'x0', gate: 'X', targets: [0] },
      { id: 'h0', gate: 'H', targets: [0] },
    ],
    latexFormula: '(|0⟩ - |1⟩)/√2',
  },
  {
    id: 'single_plus_i',
    name: '|+i⟩ (Y-Plus)',
    description: 'Superposition (|0⟩ + i|1⟩)/√2 created by H followed by S. Points to +Y.',
    numQubits: 1,
    circuit: [
      { id: 'h0', gate: 'H', targets: [0] },
      { id: 's0', gate: 'S', targets: [0] },
    ],
    latexFormula: '(|0⟩ + i|1⟩)/√2',
  },
  {
    id: 'single_minus_i',
    name: '|−i⟩ (Y-Minus)',
    description: 'Superposition (|0⟩ - i|1⟩)/√2 created by H followed by S†. Points to -Y.',
    numQubits: 1,
    circuit: [
      { id: 'h0', gate: 'H', targets: [0] },
      { id: 'sdg0', gate: 'Sdg', targets: [0] },
    ],
    latexFormula: '(|0⟩ - i|1⟩)/√2',
  },

  // Bell States (2-Qubit Entanglement)
  {
    id: 'bell_phi_plus',
    name: '|Φ⁺⟩ (Bell State 1)',
    description: 'Canonical maximally entangled Bell pair. P(|00⟩) = 50%, P(|11⟩) = 50%.',
    numQubits: 2,
    circuit: [
      { id: 'h0', gate: 'H', targets: [0] },
      { id: 'cx01', gate: 'CX', targets: [1], controls: [0] },
    ],
    latexFormula: '(|00⟩ + |11⟩)/√2',
  },
  {
    id: 'bell_phi_minus',
    name: '|Φ⁻⟩ (Bell State 2)',
    description: 'Maximally entangled Bell pair with π relative phase between |00⟩ and |11⟩.',
    numQubits: 2,
    circuit: [
      { id: 'x0', gate: 'X', targets: [0] },
      { id: 'h0', gate: 'H', targets: [0] },
      { id: 'cx01', gate: 'CX', targets: [1], controls: [0] },
    ],
    latexFormula: '(|00⟩ - |11⟩)/√2',
  },
  {
    id: 'bell_psi_plus',
    name: '|Ψ⁺⟩ (Bell State 3)',
    description: 'Maximally entangled anti-correlated state: (|01⟩ + |10⟩)/√2.',
    numQubits: 2,
    circuit: [
      { id: 'x1', gate: 'X', targets: [1] },
      { id: 'h0', gate: 'H', targets: [0] },
      { id: 'cx01', gate: 'CX', targets: [1], controls: [0] },
    ],
    latexFormula: '(|01⟩ + |10⟩)/√2',
  },
  {
    id: 'bell_psi_minus',
    name: '|Ψ⁻⟩ (Bell Singlet)',
    description: 'The singlet state (|01⟩ - |10⟩)/√2, invariant under rotation.',
    numQubits: 2,
    circuit: [
      { id: 'x0', gate: 'X', targets: [0] },
      { id: 'x1', gate: 'X', targets: [1] },
      { id: 'h0', gate: 'H', targets: [0] },
      { id: 'cx01', gate: 'CX', targets: [1], controls: [0] },
    ],
    latexFormula: '(|01⟩ - |10⟩)/√2',
  },

  // Multi-Qubit Educational Presets
  {
    id: 'ghz_3',
    name: '|GHZ⟩ (3-Qubit Greenberger–Horne–Zeilinger)',
    description: 'Three-qubit genuinely entangled state (|000⟩ + |111⟩)/√2.',
    numQubits: 3,
    circuit: [
      { id: 'h0', gate: 'H', targets: [0] },
      { id: 'cx01', gate: 'CX', targets: [1], controls: [0] },
      { id: 'cx12', gate: 'CX', targets: [2], controls: [1] },
    ],
    latexFormula: '(|000⟩ + |111⟩)/√2',
  },
  {
    id: 'teleportation_circuit',
    name: 'Quantum Teleportation Circuit',
    description: 'Teleports an unknown state on q0 to q2 using Bell entanglement on q1 and q2.',
    numQubits: 3,
    circuit: [
      // Prepare state on q0: Rx(pi/3)
      { id: 'prep0', gate: 'Rx', targets: [0], params: [Math.PI / 3] },
      // Create EPR pair between q1 and q2
      { id: 'epr_h', gate: 'H', targets: [1] },
      { id: 'epr_cx', gate: 'CX', targets: [2], controls: [1] },
      // Bell measurement on q0 and q1
      { id: 'tele_cx', gate: 'CX', targets: [1], controls: [0] },
      { id: 'tele_h', gate: 'H', targets: [0] },
      // Conditional corrections
      { id: 'corr_x', gate: 'CX', targets: [2], controls: [1] },
      { id: 'corr_z', gate: 'CZ', targets: [2], controls: [0] },
    ],
    latexFormula: 'α|0⟩ + β|1⟩ → q2',
  },
  {
    id: 'qft_3',
    name: 'Quantum Fourier Transform (3-Qubit)',
    description: 'Transforms computational basis states to frequency phase states.',
    numQubits: 3,
    circuit: [
      { id: 'h0', gate: 'H', targets: [0] },
      { id: 'crz01', gate: 'Rz', targets: [0], controls: [1], params: [Math.PI / 2] },
      { id: 'crz02', gate: 'Rz', targets: [0], controls: [2], params: [Math.PI / 4] },
      { id: 'h1', gate: 'H', targets: [1] },
      { id: 'crz12', gate: 'Rz', targets: [1], controls: [2], params: [Math.PI / 2] },
      { id: 'h2', gate: 'H', targets: [2] },
      { id: 'swap02', gate: 'SWAP', targets: [0, 2] },
    ],
    latexFormula: 'QFT |j⟩ = (1/√N) Σ exp(2πi jk/N) |k⟩',
  },
  {
    id: 'superdense_coding',
    name: 'Superdense Coding Protocol',
    description: 'Transmits 2 classical bits through 1 qubit using a pre-shared Bell pair.',
    numQubits: 2,
    circuit: [
      // EPR pair
      { id: 'epr_h', gate: 'H', targets: [0] },
      { id: 'epr_cx', gate: 'CX', targets: [1], controls: [0] },
      // Alice encodes classical '11' (applies X and Z to q0)
      { id: 'alice_z', gate: 'Z', targets: [0] },
      { id: 'alice_x', gate: 'X', targets: [0] },
      // Bob decodes
      { id: 'bob_cx', gate: 'CX', targets: [1], controls: [0] },
      { id: 'bob_h', gate: 'H', targets: [0] },
    ],
    latexFormula: 'Encode 2 bits into 1 qubit via Bell pair',
  },
];
