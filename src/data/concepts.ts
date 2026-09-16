import { Concept } from '../types/quantum';

export const CONCEPTS_DATA: Concept[] = [
  {
    id: 'qubit',
    title: 'The Qubit',
    category: 'Foundations',
    summary: 'The fundamental building block of quantum computation.',
    plainText:
      'In classical computers, the bit is strictly 0 or 1. A quantum bit (qubit) is a physical system with two distinct states, |0⟩ and |1⟩, but it can also exist in any continuous linear superposition of both states simultaneously until observed.',
    mathExplanation:
      'General single-qubit state: |ψ⟩ = α|0⟩ + β|1⟩, where α, β ∈ ℂ and the normalization condition demands |α|² + |β|² = 1. The coefficients α and β are called complex probability amplitudes.',
    keyTakeaways: [
      'A qubit is a two-level quantum system represented as a 2D complex unit vector.',
      'The computational basis states are denoted |0⟩ = [1, 0]ᵀ and |1⟩ = [0, 1]ᵀ.',
      'Unlike a classical switch, a qubit spans an entire continuous sphere of possibilities.',
    ],
    interactivePreset: {
      numQubits: 1,
      gates: [{ id: 'c_x0', gate: 'X', targets: [0] }],
    },
  },
  {
    id: 'superposition',
    title: 'Superposition',
    category: 'Foundations',
    summary: 'Existing in a coherent linear combination of states.',
    plainText:
      'Superposition allows a quantum system to hold a combination of multiple states at once. It is not an unknown classical state or statistical ignorance; rather, probability waves interfere constructively or destructively to produce quantum behavior.',
    mathExplanation:
      '|+⟩ = (|0⟩ + |1⟩)/√2 and |−⟩ = (|0⟩ - |1⟩)/√2. Measuring either yields 50% probability of 0 and 50% probability of 1, yet their internal relative phase difference (0 vs π) changes how they interact with subsequent gates.',
    keyTakeaways: [
      'Superposition is created on |0⟩ using the Hadamard (H) gate.',
      'Probabilities are given by Born’s rule: P(b) = |amplitude|².',
      'Quantum interference allows paths leading to incorrect answers to cancel out.',
    ],
    interactivePreset: {
      numQubits: 1,
      gates: [{ id: 'c_h0', gate: 'H', targets: [0] }],
    },
  },
  {
    id: 'measurement',
    title: 'Measurement & Wavefunction Collapse',
    category: 'Foundations',
    summary: 'Extracting classical information from a quantum state.',
    plainText:
      'When you measure a qubit in the computational basis, it instantly and irreversibly collapses into either |0⟩ or |1⟩. You cannot extract the exact amplitudes α and β in a single shot; you only obtain one discrete classical outcome.',
    mathExplanation:
      'Projection operator M₀ = |0⟩⟨0|, M₁ = |1⟩⟨1|. Post-measurement state after obtaining outcome m: |ψ′⟩ = M_m|ψ⟩ / √P(m). Total probability Σ P(m) = 1.',
    keyTakeaways: [
      'Measurement is non-unitary and non-reversible.',
      'To discover the underlying probability distribution, identical circuits are measured repeatedly over many "shots".',
      'The observer always measures a definite classical eigenvalue.',
    ],
    interactivePreset: {
      numQubits: 1,
      gates: [{ id: 'c_h0', gate: 'H', targets: [0] }],
    },
  },
  {
    id: 'probability_amplitude',
    title: 'Probability Amplitudes',
    category: 'Mathematics',
    summary: 'Complex numbers that dictate quantum probabilities and interference.',
    plainText:
      'Unlike classical probabilities (which are positive real numbers summing to 1), quantum amplitudes are complex numbers (with magnitude and phase). Because amplitudes can be negative or imaginary, they can cancel each other out—a phenomenon called destructive interference.',
    mathExplanation:
      'Let a = r e^{iφ}. Probability P = |a|² = r². In an n-qubit system, the statevector contains 2ⁿ complex amplitudes: |Ψ⟩ = Σ_{b=0}^{2ⁿ-1} a_b |b⟩, satisfying Σ |a_b|² = 1.',
    keyTakeaways: [
      'Amplitudes are complex numbers a = x + iy.',
      'Probability is the square of the amplitude magnitude: |a|² = x² + y².',
      'Interference is the mathematical addition of amplitudes before squaring.',
    ],
  },
  {
    id: 'quantum_phase',
    title: 'Relative Phase vs Global Phase',
    category: 'Mathematics',
    summary: 'The geometry of quantum rotations in the complex plane.',
    plainText:
      'Global phase e^{iγ}|ψ⟩ has no measurable physical effect and is completely unobservable. However, the RELATIVE phase between |0⟩ and |1⟩ (e.g., in (|0⟩ + e^{iφ}|1⟩)/√2) alters the interference pattern when rotated by further gates.',
    mathExplanation:
      'Consider |+⟩ = (|0⟩ + |1⟩)/√2 and |−⟩ = (|0⟩ - |1⟩)/√2. Both have 50/50 measurement chances for |0⟩ and |1⟩. But applying H to |+⟩ returns |0⟩ with 100% certainty, while applying H to |−⟩ returns |1⟩ with 100% certainty!',
    keyTakeaways: [
      'Global phase e^{iγ} is physically indistinguishable and does not change the Bloch vector.',
      'Relative phase φ determines the angle in the XY-equatorial plane of the Bloch sphere.',
      'Phase gates like S (π/2) and T (π/4) rotate the relative phase.',
    ],
    interactivePreset: {
      numQubits: 1,
      gates: [
        { id: 'c_h', gate: 'H', targets: [0] },
        { id: 'c_s', gate: 'S', targets: [0] },
      ],
    },
  },
  {
    id: 'bloch_sphere',
    title: 'The Bloch Sphere',
    category: 'Visualizations',
    summary: 'A 3D geometrical representation of a two-level quantum state.',
    plainText:
      'Every pure single-qubit state corresponds to exactly one point on the surface of a unit sphere. The North Pole is |0⟩, the South Pole is |1⟩, and the equator hosts superpositions with different relative phases.',
    mathExplanation:
      'Canonical representation: |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩. Cartesian coordinates: x = sin(θ)cos(φ), y = sin(θ)sin(φ), z = cos(θ). Radius r = √(x²+y²+z²) = 1 for pure states, r < 1 for mixed states.',
    keyTakeaways: [
      'Single-qubit unitary operations correspond to rigid 3D spatial rotations of this sphere.',
      'θ ∈ [0, π] controls the amplitude ratio (polar angle).',
      'φ ∈ [0, 2π) controls the quantum relative phase (azimuthal angle).',
    ],
  },
  {
    id: 'quantum_gates',
    title: 'Single-Qubit Quantum Gates',
    category: 'Operations',
    summary: 'Reversible unitary transformations of quantum states.',
    plainText:
      'Classical logic gates (like AND, OR) discard information and are irreversible. Quantum gates must be unitary operators (U†U = I), which means they preserve total probability and can always be run backward in time.',
    mathExplanation:
      'Pauli matrices: X = [[0,1],[1,0]], Y = [[0,-i],[i,0]], Z = [[1,0],[0,-1]]. Hadamard: H = 1/√2[[1,1],[1,-1]]. Phase gates: S = diag(1, i), T = diag(1, e^{iπ/4}). Arbitrary rotation: R_n(θ) = exp(-i θ n̂·σ / 2).',
    keyTakeaways: [
      'Every quantum gate corresponds to a unitary matrix U.',
      'Hermitian gates (like X, Y, Z, H) are their own inverse: H² = I, X² = I.',
      'T gate is essential for achieving universal fault-tolerant quantum computing.',
    ],
    interactivePreset: {
      numQubits: 1,
      gates: [{ id: 'c_h', gate: 'H', targets: [0] }],
    },
  },
  {
    id: 'quantum_circuit',
    title: 'Quantum Circuits',
    category: 'Operations',
    summary: 'Composing wires and gates across discrete time steps.',
    plainText:
      'A quantum circuit model represents computation as a sequence of quantum gates applied to qubit wires over time, read from left to right. At each time step, operations update the joint statevector.',
    mathExplanation:
      'If gate U₁ is applied at t=1 and U₂ at t=2, the total transformation is U_total = U₂ · U₁. Circuit depth is the number of sequential gate steps required.',
    keyTakeaways: [
      'Qubit wires run horizontally from left to right.',
      'Gates aligned vertically can be executed concurrently in hardware.',
      'The global state evolves continuously under unitary evolution |Ψ(t)⟩.',
    ],
  },
  {
    id: 'tensor_product',
    title: 'Tensor Products & Composite Systems',
    category: 'Mathematics',
    summary: 'How multi-qubit state spaces multiply exponentially.',
    plainText:
      'When two independent quantum systems are combined, their state space is not the sum of their dimensions, but the tensor product (⊗). For n qubits, the state space has 2ⁿ dimensions, enabling vast computational representations.',
    mathExplanation:
      '|q₀⟩ ⊗ |q₁⟩: [α₀, β₀]ᵀ ⊗ [α₁, β₁]ᵀ = [α₀α₁, α₀β₁, β₀α₁, β₀β₁]ᵀ. If n=3, dimension is 2³ = 8. For n=50, dimension exceeds 10¹⁵ amplitudes.',
    keyTakeaways: [
      'Basis ordering convention: |q₀ q₁ ... q_{n-1}⟩ with q₀ as most significant.',
      'Independent states satisfy |Ψ⟩ = |ψ₀⟩ ⊗ |ψ₁⟩.',
      'Entangled states cannot be factored into this tensor product form.',
    ],
  },
  {
    id: 'controlled_gates',
    title: 'Controlled Gates (CNOT, CZ, CCX)',
    category: 'Operations',
    summary: 'Conditional operations creating multi-qubit interactions.',
    plainText:
      'A controlled gate applies a transformation to a target qubit if and only if the control qubit is in state |1⟩. If the control qubit is in a superposition, it creates entanglement between the control and target.',
    mathExplanation:
      'CNOT: |c, t⟩ → |c, t ⊕ c⟩. CZ: |c, t⟩ → (-1)^{c·t}|c, t⟩. Toffoli (CCX): |c₁, c₂, t⟩ → |c₁, c₂, t ⊕ (c₁·c₂)⟩. Any multi-qubit unitary can be decomposed into single-qubit rotations and CNOT gates.',
    keyTakeaways: [
      'CNOT is the quintessential two-qubit entangling gate.',
      'CZ is symmetric: either qubit can be viewed as control or target.',
      'Toffoli allows classical reversible computation within a quantum computer.',
    ],
    interactivePreset: {
      numQubits: 2,
      gates: [
        { id: 'c_h', gate: 'H', targets: [0] },
        { id: 'c_cx', gate: 'CX', targets: [1], controls: [0] },
      ],
    },
  },
  {
    id: 'entanglement',
    title: 'Quantum Entanglement',
    category: 'Core Phenomena',
    summary: 'Non-local quantum correlations with no classical analogue.',
    plainText:
      'Two or more qubits are entangled when their joint quantum state cannot be decomposed into individual state descriptions. Measuring one qubit instantaneously updates the conditioned probability distribution of the other, regardless of spatial separation.',
    mathExplanation:
      'A pure state |Ψ⟩ is separable if |Ψ⟩ = |ψ_A⟩ ⊗ |ψ_B⟩. Otherwise, it is entangled. The reduced density matrix ρ_A = Tr_B(|Ψ⟩⟨Ψ|) has purity Tr(ρ_A²) < 1, and its Bloch vector lies inside the unit sphere (r < 1).',
    keyTakeaways: [
      'No classical signal is sent; entanglement does not allow faster-than-light communication (No-Communication Theorem).',
      'The global state is 100% pure, yet individual qubits look completely mixed locally!',
      'Entanglement is the essential fuel for quantum teleportation, superdense coding, and quantum advantage.',
    ],
    interactivePreset: {
      numQubits: 2,
      gates: [
        { id: 'c_h', gate: 'H', targets: [0] },
        { id: 'c_cx', gate: 'CX', targets: [1], controls: [0] },
      ],
    },
  },
  {
    id: 'bell_states',
    title: 'The Bell States (EPR Pairs)',
    category: 'Core Phenomena',
    summary: 'The four maximally entangled two-qubit orthonormal basis states.',
    plainText:
      'The four Bell states form a complete orthonormal basis for two qubits. In each Bell state, measuring either qubit yields 50% chance of 0 and 50% chance of 1, but measuring both reveals 100% perfect correlation or anti-correlation.',
    mathExplanation:
      '|Φ⁺⟩ = (|00⟩+|11⟩)/√2\n|Φ⁻⟩ = (|00⟩-|11⟩)/√2\n|Ψ⁺⟩ = (|01⟩+|10⟩)/√2\n|Ψ⁻⟩ = (|01⟩-|10⟩)/√2. Reduced state of either qubit: ρ = I/2 with Bloch vector (0, 0, 0) (maximum entropy).',
    keyTakeaways: [
      'Constructed with H on q0 followed by CNOT(0, 1).',
      'Local Bloch vectors shrink to the exact center origin (0, 0, 0).',
      'Used as fundamental quantum communication channels in teleportation.',
    ],
    interactivePreset: {
      numQubits: 2,
      gates: [
        { id: 'c_h', gate: 'H', targets: [0] },
        { id: 'c_cx', gate: 'CX', targets: [1], controls: [0] },
      ],
    },
  },
];
