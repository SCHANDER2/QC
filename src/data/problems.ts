import { Problem } from '../types/quantum';

export const PROBLEMS_DATA: Problem[] = [
  {
    id: 'p1_not_gate',
    title: 'Flipping a Classical Bit',
    difficulty: 'Beginner',
    category: 'Single-Qubit Gates',
    prompt: 'Which quantum gate transforms the ground state |0⟩ into the excited state |1⟩?',
    options: [
      {
        id: 'opt_x',
        text: 'Pauli-X Gate',
        isCorrect: true,
        explanation: 'Correct! The Pauli-X gate acts as quantum NOT, mapping |0⟩ → |1⟩ and |1⟩ → |0⟩.',
      },
      {
        id: 'opt_z',
        text: 'Pauli-Z Gate',
        isCorrect: false,
        explanation: 'Incorrect. The Z gate leaves |0⟩ unchanged (Z|0⟩ = |0⟩).',
      },
      {
        id: 'opt_h',
        text: 'Hadamard (H) Gate',
        isCorrect: false,
        explanation: 'Incorrect. The Hadamard gate creates superposition |+⟩ = (|0⟩+|1⟩)/√2.',
      },
      {
        id: 'opt_s',
        text: 'Phase (S) Gate',
        isCorrect: false,
        explanation: 'Incorrect. The S gate maps |0⟩ → |0⟩ and |1⟩ → i|1⟩.',
      },
    ],
    hint: 'Think of the quantum analogue to the classical NOT logic gate.',
    initialCircuit: {
      numQubits: 1,
      gates: [],
    },
    verification: {
      type: 'gate',
      targetState: '|1⟩',
    },
  },
  {
    id: 'p2_hadamard_state',
    title: 'Superposition Creation',
    difficulty: 'Beginner',
    category: 'Superposition',
    prompt: 'What is the resulting quantum state after applying a Hadamard (H) gate to the ground state |0⟩?',
    options: [
      {
        id: 'opt_plus',
        text: '|+⟩ = (|0⟩ + |1⟩)/√2',
        isCorrect: true,
        explanation: 'Correct! H|0⟩ produces the symmetric equal superposition state |+⟩.',
      },
      {
        id: 'opt_minus',
        text: '|−⟩ = (|0⟩ - |1⟩)/√2',
        isCorrect: false,
        explanation: 'Incorrect. That is H|1⟩ = |−⟩.',
      },
      {
        id: 'opt_one',
        text: '|1⟩',
        isCorrect: false,
        explanation: 'Incorrect. Applying X to |0⟩ produces |1⟩, not H.',
      },
      {
        id: 'opt_i',
        text: '|+i⟩ = (|0⟩ + i|1⟩)/√2',
        isCorrect: false,
        explanation: 'Incorrect. That requires H followed by an S gate.',
      },
    ],
    hint: 'The Hadamard gate creates an equal amplitude sum of computational basis states.',
    initialCircuit: {
      numQubits: 1,
      gates: [{ id: 'p2_h', gate: 'H', targets: [0] }],
    },
    verification: {
      type: 'state',
      targetState: '|+⟩',
    },
  },
  {
    id: 'p3_plus_measurement',
    title: 'Measurement Likelihood',
    difficulty: 'Beginner',
    category: 'Measurement',
    prompt: 'What is the theoretical probability of measuring the outcome 1 from the state |+⟩ = (|0⟩ + |1⟩)/√2?',
    options: [
      {
        id: 'opt_50',
        text: '50% (0.50)',
        isCorrect: true,
        explanation: 'Correct! The amplitude of |1⟩ is 1/√2, so probability P(1) = |1/√2|² = 1/2 = 50%.',
      },
      {
        id: 'opt_100',
        text: '100% (1.00)',
        isCorrect: false,
        explanation: 'Incorrect. Only state |1⟩ has a 100% probability of yielding 1.',
      },
      {
        id: 'opt_25',
        text: '25% (0.25)',
        isCorrect: false,
        explanation: 'Incorrect. Remember Born’s rule: square the magnitude of the amplitude.',
      },
      {
        id: 'opt_0',
        text: '0%',
        isCorrect: false,
        explanation: 'Incorrect. |+⟩ has non-zero amplitude on |1⟩.',
      },
    ],
    hint: 'Apply Born’s Rule: P(1) = |β|² where |ψ⟩ = α|0⟩ + β|1⟩.',
    initialCircuit: {
      numQubits: 1,
      gates: [{ id: 'p3_h', gate: 'H', targets: [0] }],
    },
    verification: {
      type: 'probability',
      targetProbability: { basis: '|1⟩', min: 0.49, max: 0.51 },
    },
  },
  {
    id: 'p4_bell_creation',
    title: 'Building a Bell State',
    difficulty: 'Intermediate',
    category: 'Entanglement',
    prompt: 'To construct the maximally entangled Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 from |00⟩, which sequence of two gates should be applied?',
    options: [
      {
        id: 'opt_hcx',
        text: 'H on q0, then CX (control: q0, target: q1)',
        isCorrect: true,
        explanation: 'Correct! H on q0 puts it in (|0⟩+|1⟩)/√2. Then CX flips q1 if and only if q0 is 1, yielding (|00⟩+|11⟩)/√2.',
      },
      {
        id: 'opt_cxh',
        text: 'CX (control: q0, target: q1), then H on q0',
        isCorrect: false,
        explanation: 'Incorrect. Applying CX to |00⟩ does nothing since control is 0.',
      },
      {
        id: 'opt_xx',
        text: 'X on q0, then X on q1',
        isCorrect: false,
        explanation: 'Incorrect. That produces the separable state |11⟩, not an entangled state.',
      },
      {
        id: 'opt_hh',
        text: 'H on q0, then H on q1',
        isCorrect: false,
        explanation: 'Incorrect. That produces equal superposition across all 4 states (|00⟩+|01⟩+|10⟩+|11⟩)/2.',
      },
    ],
    hint: 'First put one qubit into superposition, then entangle with a controlled-NOT.',
    initialCircuit: {
      numQubits: 2,
      gates: [
        { id: 'p4_h', gate: 'H', targets: [0] },
        { id: 'p4_cx', gate: 'CX', targets: [1], controls: [0] },
      ],
    },
  },
  {
    id: 'p5_plus_to_minus',
    title: 'Relative Phase Rotation',
    difficulty: 'Intermediate',
    category: 'Phase & Rotations',
    prompt: 'Which single gate transforms the state |+⟩ = (|0⟩ + |1⟩)/√2 into |−⟩ = (|0⟩ - |1⟩)/√2?',
    options: [
      {
        id: 'opt_z',
        text: 'Pauli-Z Gate',
        isCorrect: true,
        explanation: 'Correct! Z leaves |0⟩ alone and inverts the sign of |1⟩: Z(|0⟩+|1⟩)/√2 = (|0⟩-|1⟩)/√2.',
      },
      {
        id: 'opt_x',
        text: 'Pauli-X Gate',
        isCorrect: false,
        explanation: 'Incorrect. X|+⟩ = |+⟩ (it is an eigenstate of X with eigenvalue +1).',
      },
      {
        id: 'opt_h',
        text: 'Hadamard Gate',
        isCorrect: false,
        explanation: 'Incorrect. H|+⟩ = |0⟩.',
      },
      {
        id: 'opt_y',
        text: 'Pauli-Y Gate',
        isCorrect: false,
        explanation: 'Incorrect. Y|+⟩ = -i|−⟩ (introduces a global phase of -i).',
      },
    ],
    hint: 'You need a gate that flips the phase of |1⟩ without flipping the bit.',
    initialCircuit: {
      numQubits: 1,
      gates: [
        { id: 'p5_h', gate: 'H', targets: [0] },
        { id: 'p5_z', gate: 'Z', targets: [0] },
      ],
    },
  },
  {
    id: 'p6_toffoli_computation',
    title: 'Toffoli Logic',
    difficulty: 'Advanced',
    category: 'Multi-Qubit Gates',
    prompt: 'In a 3-qubit system initialized to |110⟩ (q0=1, q1=1, q2=0), what is the state after applying CCX with controls q0, q1 and target q2?',
    options: [
      {
        id: 'opt_111',
        text: '|111⟩',
        isCorrect: true,
        explanation: 'Correct! Since both controls q0=1 and q1=1 are active, target q2 flips from 0 to 1.',
      },
      {
        id: 'opt_110',
        text: '|110⟩',
        isCorrect: false,
        explanation: 'Incorrect. The target qubit must flip because both controls are 1.',
      },
      {
        id: 'opt_000',
        text: '|000⟩',
        isCorrect: false,
        explanation: 'Incorrect. The control qubits are not modified by the CCX gate.',
      },
      {
        id: 'opt_101',
        text: '|101⟩',
        isCorrect: false,
        explanation: 'Incorrect. Neither control qubit changes state.',
      },
    ],
    hint: 'The Toffoli gate operates as a quantum reversible AND gate: target flips when control1 AND control2 are 1.',
    initialCircuit: {
      numQubits: 3,
      gates: [
        { id: 'p6_x0', gate: 'X', targets: [0] },
        { id: 'p6_x1', gate: 'X', targets: [1] },
        { id: 'p6_ccx', gate: 'CCX', targets: [2], controls: [0, 1] },
      ],
    },
  },
  {
    id: 'p7_bloch_entanglement_purity',
    title: 'Local Mixed State of Bell Pairs',
    difficulty: 'Advanced',
    category: 'Entanglement & Purity',
    prompt: 'For the Bell state (|00⟩ + |11⟩)/√2, what is the length (radius r) of the reduced Bloch vector for qubit 0?',
    options: [
      {
        id: 'opt_zero',
        text: 'r ≈ 0 (at the origin of the sphere)',
        isCorrect: true,
        explanation: 'Correct! The reduced state is maximally mixed ρ = I/2, whose Bloch coordinates are (0, 0, 0) with radius r = 0.',
      },
      {
        id: 'opt_one',
        text: 'r = 1 (on the surface of the sphere)',
        isCorrect: false,
        explanation: 'Incorrect. Only pure single-qubit states lie on the surface (r = 1). Entangled qubits have r < 1.',
      },
      {
        id: 'opt_half',
        text: 'r = 0.5',
        isCorrect: false,
        explanation: 'Incorrect. Maximally mixed state has x=0, y=0, z=0, so r = √(0²+0²+0²) = 0.',
      },
      {
        id: 'opt_inv_sqrt2',
        text: 'r = 1/√2 ≈ 0.707',
        isCorrect: false,
        explanation: 'Incorrect. The coordinates vanish entirely due to maximum local entropy.',
      },
    ],
    hint: 'Calculate the partial trace over qubit 1. The resulting density matrix is proportional to the Identity matrix.',
  },
];
