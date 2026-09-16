# QuantumLearn — Architectural Specification

## 1. Architectural Philosophy: The Quantum State as Single Source of Truth

The most critical design invariant in QuantumLearn is:

```text
Circuit Operations / User Interventions
              │
              ▼
   Statevector Engine (Pure TS)
              │
              ▼
Current Global Pure State |Ψ⟩ (2ⁿ complex amplitudes)
              │
   ┌──────────┴──────────┬──────────────────┬─────────────────┐
   ▼                     ▼                  ▼                 ▼
Amplitudes         Probabilities     Reduced States      Visualizations
& Phases           P(b) = |a_b|²      ρ_q = Tr_¬q        (3D Bloch Spheres)
```

1. **No Fake Interactions**: UI controls never mutate visual points directly. Sliders or gate clicks dispatch mathematical operations to the simulation engine, which updates the statevector. All downstream visualizations (Bloch angles, probability bars, phase tables) are purely derived from this single authoritative state.
2. **Decoupled Quantum Engine**: All mathematical calculations (`ComplexNumber`, `QuantumState`, `QuantumEngine`, `DensityMatrixUtils`, `QuantumMeasurement`, `QuantumCircuit`) are pure TypeScript modules completely independent of React and Three.js.
3. **No Unnecessary DOM Flooding**: Operations scale cleanly up to 8 qubits ($2^8 = 256$ amplitudes), using efficient sparse butterfly updates rather than dense $2^n \times 2^n$ matrix multiplications.

---

## 2. Directory Structure

```text
src/
├── types/
│   └── quantum.ts            # Core TypeScript interfaces & data contracts
├── quantum/
│   ├── complex.ts            # Complex arithmetic (add, sub, mul, div, phase, mag)
│   ├── state.ts              # QuantumState class, normalization & basis indexing
│   ├── gates.ts              # Unitary matrices, definitions & parameterizations
│   ├── engine.ts             # Statevector gate application & butterfly transforms
│   ├── density.ts            # Partial trace, reduced 2x2 density matrix & Bloch vectors
│   ├── measurement.ts        # Projective measurement, wavefunction collapse, shot sampler
│   ├── circuit.ts            # QuantumCircuit model, step snapshots, serialization
│   ├── presets.ts            # Canonical circuits (Bell, GHZ, Teleportation, QFT)
│   └── explanation.ts        # Natural language pedagogical explanations
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx        # Academic header, mode toggle & primary tabs
│   │   └── Sidebar.tsx       # Sidebar navigation menu
│   ├── circuit/
│   │   ├── CircuitGrid.tsx   # Interactive wireframe grid editor
│   │   ├── CircuitControls.tsx # Playback timeline stepper & history controls
│   │   └── GatePalette.tsx   # Gate palette for beginner and explorer sets
│   ├── simulator/
│   │   ├── AmplitudeTable.tsx# Basis amplitudes, probabilities & phase indicators
│   │   ├── MeasurementPanel.tsx # Single-shot collapse & multi-shot histogram
│   │   └── ExplanationBanner.tsx # "What just happened?" & mathematical formalism
│   └── visualization/
│       ├── BlochSphere3D.tsx # High-precision Three.js 3D Bloch sphere
│       └── MultiBlochView.tsx# Array of reduced Bloch spheres with purity indicator
├── views/
│   ├── HomeView.tsx          # Landing page & learning paths
│   ├── BlochSphereView.tsx   # Interactive single-qubit Bloch sphere laboratory
│   ├── GatesView.tsx         # Unitary operator matrix directory & comparisons
│   ├── CircuitsView.tsx      # Benchmark quantum algorithms library
│   ├── SimulateView.tsx      # Multi-Qubit Simulator flagship workspace
│   ├── ConceptsView.tsx      # 13 structured conceptual modules with live state
│   ├── ProblemsView.tsx      # Interactive exercises with automated verification
│   └── VisualizationsView.tsx# Multi-qubit density matrix & probability visualizer
├── data/
│   ├── concepts.ts           # Curated conceptual syllabus
│   └── problems.ts           # Challenge problem bank
├── tests/                    # Vitest automated test suite
├── App.tsx                   # Top-level application coordinator
├── main.tsx                  # React 18 DOM mount
└── index.css                 # Tailwind CSS & academic laboratory theme
```

---

## 3. Circuit Execution Flow

1. **Step Snapshotting**: When `circuit.simulate()` is invoked, the engine begins at $t=0$ in ground state $|0\dots0\rangle$.
2. For each gate operation at step $k$:
   - The operation is validated against qubit bounds.
   - The transformation $|\Psi_k\rangle = U_k |\Psi_{k-1}\rangle$ is applied.
   - Reduced density matrices $\rho_q$ and Bloch vectors $(x, y, z, r, \theta, \phi)$ are computed for all $n$ qubits.
   - Pedagogical explanations are generated comparing $|\Psi_{k-1}\rangle$ and $|\Psi_k\rangle$.
   - A `SimulationSnapshot` is stored.
3. The UI timeline stepper simply indexes into this pre-calculated snapshot array, ensuring sub-millisecond scrubber responsiveness with zero lag.
