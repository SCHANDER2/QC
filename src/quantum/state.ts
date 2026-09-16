import { ComplexNumber, EPSILON } from './complex';
import { AmplitudeItem } from '../types/quantum';

/**
 * QuantumState represents an n-qubit pure state vector |Ψ⟩ = Σ a_b |b⟩.
 * 
 * BASIS ORDER CONVENTION:
 * |q0 q1 ... q(n-1)>
 * - q0 is the leftmost / most-significant displayed qubit.
 * - q(n-1) is the rightmost / least-significant qubit.
 * 
 * In binary integer representation:
 * For a state index i (0 <= i < 2^n), the binary string is b_0 b_1 ... b_{n-1}
 * where b_q = (i >> (n - 1 - q)) & 1.
 * 
 * Example for n = 2:
 * index 0 = 00 = |00> (q0=0, q1=0)
 * index 1 = 01 = |01> (q0=0, q1=1)
 * index 2 = 10 = |10> (q0=1, q1=0)
 * index 3 = 11 = |11> (q0=1, q1=1)
 */
export class QuantumState {
  public readonly numQubits: number;
  public readonly dimension: number;
  public readonly statevector: ComplexNumber[];

  constructor(numQubits: number, statevector?: ComplexNumber[]) {
    if (numQubits < 1 || numQubits > 16) {
      throw new Error(`Invalid qubit count: ${numQubits}. Must be between 1 and 16.`);
    }
    this.numQubits = numQubits;
    this.dimension = 1 << numQubits;

    if (statevector) {
      if (statevector.length !== this.dimension) {
        throw new Error(`Statevector length ${statevector.length} does not match dimension ${this.dimension} for ${numQubits} qubits.`);
      }
      this.statevector = statevector.map(c => ComplexNumber.from(c));
    } else {
      // Default: |00...0>
      this.statevector = new Array(this.dimension).fill(null).map((_, idx) => (idx === 0 ? ComplexNumber.one() : ComplexNumber.zero()));
    }
  }

  /**
   * Initializes state to |00...0>.
   */
  static zeroState(numQubits: number): QuantumState {
    return new QuantumState(numQubits);
  }

  /**
   * Initializes state to computational basis state |b0 b1 ... b_{n-1}>.
   */
  static basisState(numQubits: number, basisIndex: number): QuantumState {
    const dim = 1 << numQubits;
    if (basisIndex < 0 || basisIndex >= dim) {
      throw new Error(`Basis index ${basisIndex} out of bounds for ${numQubits} qubits.`);
    }
    const sv = new Array(dim).fill(null).map((_, idx) => (idx === basisIndex ? ComplexNumber.one() : ComplexNumber.zero()));
    return new QuantumState(numQubits, sv);
  }

  /**
   * Initializes from arbitrary amplitude array, normalizes it.
   */
  static fromAmplitudes(numQubits: number, amplitudes: ComplexNumber[]): QuantumState {
    const state = new QuantumState(numQubits, amplitudes);
    return state.normalize();
  }

  /**
   * Calculates total probability: Σ |a_i|²
   */
  getTotalProbability(): number {
    return this.statevector.reduce((sum, amp) => sum + amp.magnitudeSquared(), 0);
  }

  /**
   * Returns true if normalized within tolerance: |Σ |a_i|² - 1| <= tol
   */
  isNormalized(tol: number = 1e-6): boolean {
    return Math.abs(this.getTotalProbability() - 1.0) <= tol;
  }

  /**
   * Normalizes statevector. Throws if state has zero norm.
   */
  normalize(): QuantumState {
    const totalProb = this.getTotalProbability();
    if (totalProb < EPSILON * EPSILON) {
      throw new Error('Cannot normalize a zero-norm quantum state vector.');
    }
    const normFactor = Math.sqrt(totalProb);
    const newSv = this.statevector.map(amp => amp.div(normFactor));
    return new QuantumState(this.numQubits, newSv);
  }

  /**
   * Returns array of measurement probabilities for each computational basis state.
   */
  getProbabilities(): number[] {
    return this.statevector.map(amp => amp.magnitudeSquared());
  }

  /**
   * Computes amplitude list with basis labels, probabilities, and phase in degrees.
   */
  getAmplitudes(): AmplitudeItem[] {
    return this.statevector.map((amp, idx) => {
      const basis = idx.toString(2).padStart(this.numQubits, '0');
      const prob = amp.magnitudeSquared();
      const phaseRad = amp.phase();
      const phaseDeg = (amp.phasePositive() * 180) / Math.PI;

      return {
        index: idx,
        basis: `|${basis}⟩`,
        amplitude: amp,
        probability: prob,
        phaseRad,
        phaseDeg: Math.round(phaseDeg * 100) / 100,
      };
    });
  }

  /**
   * Get bit value (0 or 1) of qubit q in basis index i.
   */
  getQubitBit(basisIndex: number, qubit: number): number {
    return (basisIndex >> (this.numQubits - 1 - qubit)) & 1;
  }

  /**
   * Clone the quantum state.
   */
  clone(): QuantumState {
    return new QuantumState(this.numQubits, [...this.statevector]);
  }

  /**
   * Checks equality with another QuantumState up to global phase and tolerance.
   */
  equals(other: QuantumState, tol: number = 1e-6): boolean {
    if (this.numQubits !== other.numQubits) return false;
    for (let i = 0; i < this.dimension; i++) {
      if (!this.statevector[i].equals(other.statevector[i], tol)) {
        return false;
      }
    }
    return true;
  }
}
