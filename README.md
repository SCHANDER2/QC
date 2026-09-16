# QuantumLearn — Interactive Quantum Computing Learning Platform

An interactive, mathematically rigorous quantum-computing education platform engineered with an exact statevector simulator, 3D Bloch Sphere visualization, multi-qubit circuit builder, step-by-step unitary execution, and comprehensive interactive curricula.

![QuantumLearn](public/favicon.svg)

---

## 🎯 Educational Philosophy

**Learn → Manipulate → Observe → Understand → Build Circuits → Measure → Experiment.**

QuantumLearn avoids superficial sci-fi aesthetics and black-box approximations. The application runs a genuine linear-algebra statevector engine in pure TypeScript, faithfully demonstrating quantum superposition, unitary matrix transformations, Born rule measurement collapse, and non-local entanglement.

---

## 🔬 Key Architectural Capabilities

1. **Exact Multi-Qubit Statevector Simulator (1–8 Qubits)**:
   - Full $2^n$-dimensional complex amplitude statevector $|\Psi\rangle = \sum_{b=0}^{2^n-1} a_b |b\rangle$.
   - Rigorous normalization invariant $\sum |a_b|^2 = 1.0$ within numerical tolerance $\epsilon = 10^{-10}$.
   - Arbitrary control and target qubit configurations for $CX, CZ, CCX$ (Toffoli), and $SWAP$.

2. **Strict Basis Order Convention**:
   - Standard quantum computing convention: $|q_0 q_1 \dots q_{n-1}\rangle$, where $q_0$ is the leftmost / most-significant qubit.
   - For 2 qubits: $|00\rangle \to 0$, $|01\rangle \to 1$, $|10\rangle \to 2$, $|11\rangle \to 3$.

3. **High-Fidelity 3D Bloch Sphere**:
   - Orbit controls (click & drag to rotate, scroll to zoom) with Three.js rendering.
   - Polar angle $\theta \in [0, \pi]$ and azimuthal angle $\phi \in [0, 2\pi)$ projection arcs.
   - Direct angle manipulation updating the canonical pure state $|\psi\rangle = \cos(\theta/2)|0\rangle + e^{i\phi}\sin(\theta/2)|1\rangle$.

4. **Multi-Qubit Reduced Density Matrix Purity**:
   - For multi-qubit systems, each qubit displays its local reduced state derived from partial tracing:
     $$\rho_q = \text{Tr}_{\setminus q}(|\Psi\rangle\langle\Psi|)$$
   - For entangled states (e.g. Bell states $|\Phi^+\rangle$), the local reduced state is maximally mixed ($\rho = I/2$), causing the local Bloch vector to collapse toward the origin ($r \approx 0$). It is never artificially forced onto the unit sphere!

5. **Quantum Circuit Editor & Timeline Stepper**:
   - Add/remove qubits, insert gates from an academic palette, delete operations, and drag time steps.
   - Playback engine supporting **Play**, **Step Forward**, **Step Back**, **Pause**, **Reset**, and **Undo/Redo**.
   - Natural language pedagogical explanations accompanied by formal matrix transformations for every operation.

6. **Projective Measurement & Histogram Statistics**:
   - Single-shot projective measurement with irreversible statevector collapse.
   - Multi-shot Monte Carlo sampler (100, 1024, 4096 shots) comparing theoretical Born probabilities with experimental frequencies.

7. **Dual Interface Depth**:
   - **Beginner Mode**: Intuitive explanations, essential gates ($X, Y, Z, H, S, T, CX, CZ$), and clear visualizations.
   - **Explorer Mode**: Explicit Dirac notation, unitary matrices, phase wheels, statevector tables, and advanced gates ($S^\dagger, T^\dagger, \sqrt{X}, \sqrt{Y}, R_x, R_y, R_z, P(\lambda), CCX$).

8. **Comprehensive Curricula & Problems**:
   - **13 Interactive Concepts**: Foundations, Mathematics, Visualizations, Operations, and Core Phenomena.
   - **Interactive Problem Set**: Automated verification, hints, explanations, and local score tracking.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/SCHANDER2/QC.git
cd QC

# Install dependencies
npm install
```

### Running Locally (Development Mode)
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Running Automated Test Suite
```bash
npm test
```
Runs the Vitest suite verifying complex arithmetic, gate unitaries, multi-qubit tensor operators, partial traces, Bell/GHZ state synthesis, and measurement collapse.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🎨 Academic Design System

- **Background**: `#F6F4EE` (Warm ivory)
- **Surface**: `#FFFDF8` (Off-white paper card)
- **Primary Green**: `#2F5D50` (Muted academic forest green)
- **Dark Text**: `#17211D` (Deep charcoal)
- **Warm Accent**: `#B65331` (Restrained terracotta)
- **Soft Green**: `#E4ECE6` (Pastel badge accent)
- **Border**: `#D9D8D0` (Subtle boundary lines)
- **Typography**: Inter (Body), Newsreader (Serif Headings), JetBrains Mono (Code/Dirac Math)
