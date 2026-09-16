# QuantumLearn — Verification & Test Strategy

This document details the test suites, verification protocols, and mathematical invariants checked in QuantumLearn.

---

## 1. Automated Test Suite Summary

The automated test suite runs via **Vitest** with 7 dedicated test suites and **36 unit tests**, covering:

```bash
npx vitest run
```

### Test Coverage Breakdown:
1. `src/tests/complex.test.ts` (8 tests):
   - Addition, subtraction, multiplication, and division.
   - Complex conjugate and magnitude squared ($|z|^2 = x^2 + y^2$).
   - Phase calculation in radians and degrees.
   - Tolerant equality ($\epsilon = 10^{-10}$) and negative-zero normalization.
   - Division by zero error handling.

2. `src/tests/state.test.ts` (4 tests):
   - Normalization invariant $\sum |a_i|^2 = 1.0$.
   - Basis state generation and binary indexing ($|q_0 \dots q_{n-1}\rangle$).
   - Zero-norm error protection.
   - Amplitudes and measurement probability calculation.

3. `src/tests/gates.test.ts` (6 tests):
   - Involution / idempotency checks:
     $$X^2 = I, \quad Y^2 = I, \quad Z^2 = I, \quad H^2 = I, \quad S^4 = I, \quad T^8 = I$$
   - Canonical single-qubit transformations:
     $$X|0\rangle = |1\rangle, \quad X|1\rangle = |0\rangle$$
     $$H|0\rangle = |+\rangle, \quad H|1\rangle = |-\rangle$$
     $$Z|+\rangle = |-\rangle, \quad S|+\rangle = |+i\rangle$$
   - Parameterized rotations ($R_x, R_y, R_z$) at $90^\circ, 180^\circ, 270^\circ$.

4. `src/tests/multi_qubit.test.ts` (5 tests):
   - Controlled-NOT (CNOT/CX) gate logic on arbitrary control and target indices.
   - Controlled-Z (CZ) symmetric phase inversion on $|11\rangle$.
   - SWAP gate swapping arbitrary pairs of qubits.
   - Toffoli (CCX) reversible AND logic on 3 qubits.
   - Entangling operation $CX(0, 1)$ on superposition creating Bell state $|\Phi^+\rangle$.

5. `src/tests/density.test.ts` (4 tests):
   - Partial trace extracting reduced $2 \times 2$ density matrix $\rho_q$.
   - Single-qubit pure state yields $r = 1.0$ and purity $\gamma = 1.0$.
   - Bell state $(|00\rangle + |11\rangle)/\sqrt{2}$ yields maximally mixed reduced state $\rho = \frac{1}{2}I$, Bloch vector $(0, 0, 0)$, $r < 0.01$, and purity $\gamma = 0.5$.
   - Conversion from spherical $(\theta, \phi)$ to statevector and round-trip consistency.

6. `src/tests/measurement.test.ts` (4 tests):
   - Full-system projective measurement with wavefunction collapse.
   - Born rule probability distribution verification.
   - Single-qubit measurement with post-measurement normalized state.
   - Repeated shot simulation and frequency histogram convergence.

7. `src/tests/circuit.test.ts` (5 tests):
   - Step snapshot generation ($t=0\dots T$).
   - Bell state synthesis and step verification.
   - 3-qubit GHZ state $(|000\rangle + |111\rangle)/\sqrt{2}$ synthesis.
   - Circuit JSON serialization and deserialization.
   - Safe qubit addition and deletion guards.

---

## 2. End-to-End Browser QA Verification Checklist

| Flow / Feature | Verification Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **Home Navigation** | Click "Open Simulator", "Start with Qubits", or path cards. | Instantly routes to designated laboratory view. | **PASS** |
| **3D Bloch Sphere View** | Drag sliders $\theta \in [0, 180^\circ]$ and $\phi \in [0, 360^\circ]$. | Vector arrow updates; coordinate box shows $x, y, z$; Dirac formula updates. | **PASS** |
| **Bloch Quick Gates** | Click X, Y, Z, H buttons. | State updates via unitary matrix; sliders reflect rotated coordinates. | **PASS** |
| **Multi-Qubit Simulator** | Change qubit count from 2 to 3, 4, ..., 8. | Wireframe grid dynamically adjusts; statevector expands to $2^n$ basis states. | **PASS** |
| **Circuit Gate Placement** | Select H from palette, click on q0 wire at t=1. Select CX, click on q1 wire at t=2. | Generates CNOT with control dot on q0 and $\oplus$ on q1; Bell state created. | **PASS** |
| **Timeline Playback** | Click "Run Circuit", "Step Forward", "Step Back", "Reset". | Scrubber highlights current step; explanation banner updates; undo/redo tracks history. | **PASS** |
| **Mixed State Bloch Sphere** | Observe q0 and q1 Bloch spheres after creating Bell state. | Both spheres display vector collapsed to origin with length $r \approx 0$ and "Entangled Mixed" badge. | **PASS** |
| **Measurement & Collapse** | Click "Measure & Collapse". | Wavefunction irreversibly collapses to one basis state; badge shows collapsed state. | **PASS** |
| **Repeated Shots** | Select 1024 shots, click "Run 1024 Shots". | Generates histogram with ~50% $|00\rangle$ and ~50% $|11\rangle$. | **PASS** |
| **Concepts Curriculum** | Navigate through 13 concepts, toggle "Show Formalism". | Displays intuitive summary, live state calculation, and Dirac math equations. | **PASS** |
| **Problem Lab** | Attempt Problem 1, click "Submit Answer". | Feedback banner highlights correctness, displays pedagogical explanation, and updates score. | **PASS** |
| **Explorer Mode** | Click mode toggle in top right navbar. | Enables advanced gates ($S^\dagger, T^\dagger, \sqrt{X}, \dots$) and phase angle columns in tables. | **PASS** |
