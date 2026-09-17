import { ComplexNumber, EPSILON } from './complex';
import { QuantumState } from './state';
import { BlochVector, DensityMatrix2x2 } from '../types/quantum';

export class DensityMatrixUtils {
  /**
   * Computes the 2x2 reduced density matrix for a target qubit by partial tracing
   * over all other qubits in the n-qubit system.
   */
  static getReducedDensityMatrix(state: QuantumState, targetQubit: number): DensityMatrix2x2 {
    const n = state.numQubits;
    if (targetQubit < 0 || targetQubit >= n) {
      throw new Error(`Target qubit ${targetQubit} out of range [0, ${n - 1}].`);
    }

    const tMask = 1 << (n - 1 - targetQubit);
    let rho00 = 0;
    let rho11 = 0;
    let rho01Real = 0;
    let rho01Imag = 0;

    for (let i = 0; i < state.dimension; i++) {
      if ((i & tMask) === 0) {
        const i0 = i;
        const i1 = i | tMask;

        const a0 = state.statevector[i0];
        const a1 = state.statevector[i1];

        // Diagonal elements
        rho00 += a0.magnitudeSquared();
        rho11 += a1.magnitudeSquared();

        // Off-diagonal: a0 * conj(a1)
        // (a0.r + i a0.i) * (a1.r - i a1.i)
        // = (a0.r * a1.r + a0.i * a1.i) + i(a0.i * a1.r - a0.r * a1.i)
        const crossReal = a0.real * a1.real + a0.imag * a1.imag;
        const crossImag = a0.imag * a1.real - a0.real * a1.imag;

        rho01Real += crossReal;
        rho01Imag += crossImag;
      }
    }

    const rho01 = new ComplexNumber(rho01Real, rho01Imag);
    const rho10 = rho01.conj();

    return {
      rho00: new ComplexNumber(rho00, 0),
      rho01,
      rho10,
      rho11: new ComplexNumber(rho11, 0),
    };
  }

  /**
   * Computes the Bloch vector (x, y, z, r, theta, phi, purity) for a specific qubit.
   * For mixed states resulting from entanglement, r < 1 and the vector lies inside the sphere!
   */
  static getBlochVector(state: QuantumState, targetQubit: number): BlochVector {
    const rho = this.getReducedDensityMatrix(state, targetQubit);

    // x = 2 * Re(rho01)
    const x = 2 * rho.rho01.real;
    // y = -2 * Im(rho01) (from Pauli Y: Tr(rho * Y))
    const y = -2 * rho.rho01.imag;
    // z = rho00 - rho11
    const z = rho.rho00.real - rho.rho11.real;

    let r = Math.sqrt(x * x + y * y + z * z);
    if (r > 1.0) r = 1.0; // clamp minor float overflow

    // Purity: Tr(rho^2) = (1 + r^2) / 2
    const purity = (1 + r * r) / 2;

    let theta = 0;
    let phi = 0;

    if (r > EPSILON) {
      // Normalized z coordinate on the sphere of radius r
      const normZ = Math.max(-1, Math.min(1, z / r));
      theta = Math.acos(normZ);

      // Handle poles: at north and south pole, azimuth angle has no physical significance
      const isPole = theta < 1e-4 || Math.abs(theta - Math.PI) < 1e-4;
      if (!isPole) {
        phi = Math.atan2(y, x);
        if (phi < 0) phi += 2 * Math.PI;
      }
    }

    // Von Neumann entanglement entropy in ebits S(rho) = -Tr(rho log2 rho)
    const l1 = (1 + r) / 2;
    const l2 = (1 - r) / 2;
    let entropy = 0;
    if (l1 > EPSILON) entropy -= l1 * Math.log2(l1);
    if (l2 > EPSILON) entropy -= l2 * Math.log2(l2);
    entropy = Math.max(0, Math.min(1.0, Math.abs(entropy) < EPSILON ? 0 : entropy));

    return {
      qubitIndex: targetQubit,
      x: Math.abs(x) < EPSILON ? 0 : x,
      y: Math.abs(y) < EPSILON ? 0 : y,
      z: Math.abs(z) < EPSILON ? 0 : z,
      r: Math.abs(r) < EPSILON ? 0 : r,
      theta,
      phi,
      purity: Math.abs(purity) < EPSILON ? 0.5 : purity,
      entropy,
    };
  }

  /**
   * Returns Bloch vectors for all qubits in the state.
   */
  static getAllBlochVectors(state: QuantumState): BlochVector[] {
    const vectors: BlochVector[] = [];
    for (let q = 0; q < state.numQubits; q++) {
      vectors.push(this.getBlochVector(state, q));
    }
    return vectors;
  }

  /**
   * Converts spherical (theta, phi) coordinates to single-qubit canonical state:
   * |psi> = cos(theta/2)|0> + exp(i phi) sin(theta/2)|1>
   */
  static stateFromAngles(theta: number, phi: number): QuantumState {
    const half = theta / 2;
    const c = Math.cos(half);
    const s = Math.sin(half);
    const alpha = new ComplexNumber(c, 0);
    const beta = new ComplexNumber(s * Math.cos(phi), s * Math.sin(phi));
    return new QuantumState(1, [alpha, beta]).normalize();
  }

  /**
   * Converts Cartesian (x, y, z) on unit sphere to single-qubit canonical state.
   */
  static stateFromCartesian(x: number, y: number, z: number): QuantumState {
    const len = Math.sqrt(x * x + y * y + z * z);
    if (len < EPSILON) {
      return QuantumState.zeroState(1);
    }
    const nx = x / len;
    const ny = y / len;
    const nz = Math.max(-1, Math.min(1, z / len));

    const theta = Math.acos(nz);
    let phi = 0;
    if (theta > 1e-4 && Math.abs(theta - Math.PI) > 1e-4) {
      phi = Math.atan2(ny, nx);
      if (phi < 0) phi += 2 * Math.PI;
    }
    return this.stateFromAngles(theta, phi);
  }
}
