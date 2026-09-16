# QuantumLearn — Quantum Mathematical Model & Formalisms

This document details the exact mathematical conventions, formulas, and algorithms implemented in QuantumLearn.

---

## 1. Basis Convention (Locked Everywhere)

We strictly enforce the canonical convention:

$$|q_0 q_1 \dots q_{n-1}\rangle$$

where:
- $q_0$ is the **leftmost**, most-significant displayed qubit.
- $q_{n-1}$ is the **rightmost**, least-significant displayed qubit.

For any basis state index $i \in [0, 2^n - 1]$, the state of qubit $q \in [0, n-1]$ is given by:

$$b_q = \left(i \gg (n - 1 - q)\right) \ \& \ 1$$

### Explicit Basis Ordering Examples

#### Two Qubits ($n = 2$):
- Index 0: $|00\rangle$ ($q_0 = 0, q_1 = 0$)
- Index 1: $|01\rangle$ ($q_0 = 0, q_1 = 1$)
- Index 2: $|10\rangle$ ($q_0 = 1, q_1 = 0$)
- Index 3: $|11\rangle$ ($q_0 = 1, q_1 = 1$)

#### Three Qubits ($n = 3$):
- Index 0: $|000\rangle$
- Index 1: $|001\rangle$
- Index 2: $|010\rangle$
- Index 3: $|011\rangle$
- Index 4: $|100\rangle$
- Index 5: $|101\rangle$
- Index 6: $|110\rangle$
- Index 7: $|111\rangle$

---

## 2. Statevector Representation & Invariant

An $n$-qubit pure state is represented by a complex statevector:

$$|\Psi\rangle = \sum_{b=0}^{2^n-1} a_b |b\rangle, \quad a_b \in \mathbb{C}$$

### Normalization Invariant
$$\sum_{b=0}^{2^n-1} |a_b|^2 = 1.0 \pm \epsilon, \quad \epsilon = 10^{-10}$$

Whenever custom states are initialized or projective measurements are executed, the vector is explicitly normalized by dividing each amplitude by $\sqrt{\sum |a_b|^2}$. Zero-norm vectors throw explicit exceptions.

---

## 3. Single-Qubit Parameterization & Bloch Geometry

A pure single-qubit state $|\psi\rangle$ is uniquely parameterized up to an unobservable global phase by polar angle $\theta \in [0, \pi]$ and azimuthal angle $\phi \in [0, 2\pi)$:

$$|\psi\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle + e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle$$

### Cartesian Bloch Coordinates
$$x = \sin\theta \cos\phi$$
$$y = \sin\theta \sin\phi$$
$$z = \cos\theta$$

### Computational Basis Probabilities
$$P(0) = \cos^2\left(\frac{\theta}{2}\right) = \frac{1+z}{2}$$
$$P(1) = \sin^2\left(\frac{\theta}{2}\right) = \frac{1-z}{2}$$

### Pole Singularities
At the North Pole ($\theta = 0$, state $|0\rangle$) and South Pole ($\theta = \pi$, state $|1\rangle$), the azimuthal angle $\phi$ has no physical significance. The engine suppresses arbitrary phase fluctuations at these poles.

---

## 4. Multi-Qubit Reduced Density Matrices & Partial Trace

For an $n$-qubit pure state $|\Psi\rangle$, the density operator is:

$$\rho = |\Psi\rangle\langle\Psi|$$

To extract the local state of qubit $q$, we perform a **partial trace** over all remaining $n-1$ qubits:

$$\rho_q = \text{Tr}_{\setminus q}(\rho) = \begin{bmatrix} \rho_{00} & \rho_{01} \\ \rho_{10} & \rho_{11} \end{bmatrix}$$

where:
$$\rho_{00} = \sum_{i, b_q=0} |a_i|^2$$
$$\rho_{11} = \sum_{i, b_q=1} |a_i|^2$$
$$\rho_{01} = \sum_{i_0, i_1} a_{i_0} a_{i_1}^*, \quad (i_0 \text{ has } b_q=0, \ i_1 = i_0 \oplus 2^{n-1-q})$$
$$\rho_{10} = \rho_{01}^*$$

### Local Bloch Vector Derivation
Using the Pauli basis expansion $\rho_q = \frac{1}{2}(I + xX + yY + zZ)$:

$$x = \text{Tr}(\rho_q X) = 2 \text{Re}(\rho_{01})$$
$$y = \text{Tr}(\rho_q Y) = -2 \text{Im}(\rho_{01})$$
$$z = \text{Tr}(\rho_q Z) = \rho_{00} - \rho_{11}$$
$$r = \sqrt{x^2 + y^2 + z^2} \le 1$$

### Purity
$$\gamma = \text{Tr}(\rho_q^2) = \frac{1 + r^2}{2}$$

- **Pure Single-Qubit State**: $r = 1 \implies \gamma = 1$. The state lies on the surface of the sphere.
- **Entangled Subsystem**: $r < 1 \implies \frac{1}{2} \le \gamma < 1$. The state lies **inside** the sphere.
- **Maximally Mixed State (e.g. Bell State)**: $\rho_q = \frac{1}{2}I \implies (x, y, z) = (0, 0, 0), \ r = 0, \ \gamma = 0.5$.

---

## 5. Gate Definitions & Unitary Matrices

### Single-Qubit Gates
- **Pauli-X**: $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ (Bit flip, $X^2 = I$)
- **Pauli-Y**: $\begin{bmatrix} 0 & -i \\ i & 0 \end{bmatrix}$ ($Y^2 = I$)
- **Pauli-Z**: $\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$ (Phase flip, $Z^2 = I$)
- **Hadamard (H)**: $\frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$ ($H^2 = I$)
- **Phase (S)**: $\begin{bmatrix} 1 & 0 \\ 0 & i \end{bmatrix}$ ($S^2 = Z, S^4 = I$)
- **T Gate**: $\begin{bmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{bmatrix}$ ($T^2 = S, T^8 = I$)
- **Rotations**:
  $$R_x(\theta) = \cos(\theta/2)I - i\sin(\theta/2)X$$
  $$R_y(\theta) = \cos(\theta/2)I - i\sin(\theta/2)Y$$
  $$R_z(\theta) = \cos(\theta/2)I - i\sin(\theta/2)Z$$

### Multi-Qubit Gates
- **Controlled-NOT (CX)**: Flips target if control is 1: $|c, t\rangle \to |c, t \oplus c\rangle$.
- **Controlled-Z (CZ)**: Inverts phase of $|11\rangle$: $|c, t\rangle \to (-1)^{c \cdot t}|c, t\rangle$.
- **SWAP**: Exchanges states of two qubits: $|a, b\rangle \to |b, a\rangle$.
- **Toffoli (CCX)**: Flips target if both controls are 1: $|c_1, c_2, t\rangle \to |c_1, c_2, t \oplus (c_1 \cdot c_2)\rangle$.

---

## 6. Projective Measurement & Collapse

1. **Probability Distribution**: Given state $|\Psi\rangle$, the probability of computational basis state $|b\rangle$ is:
   $$P(b) = |a_b|^2$$
2. **Projective Single-Shot Collapse**:
   - An outcome $m \in [0, 2^n - 1]$ is sampled according to discrete distribution $\{P(b)\}$.
   - All amplitudes $a_b$ for $b \ne m$ are set to 0.
   - The amplitude $a_m$ is set to $1.0$, collapsing the statevector to $|m\rangle$.
3. **Repeated Shots**:
   - Independent random trials are sampled from $\{P(b)\}$ without altering the primary active circuit state, accumulating an experimental count histogram.
