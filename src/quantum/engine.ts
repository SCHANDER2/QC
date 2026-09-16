import { ComplexNumber } from './complex';
import { QuantumState } from './state';
import { GateOperation, GateType } from '../types/quantum';
import { getGateMatrix2x2, Matrix2x2 } from './gates';

export class QuantumEngine {
  /**
   * Validates operation target and control indices against system size.
   */
  static validateOperation(numQubits: number, op: GateOperation): void {
    const { gate, targets, controls } = op;

    if (!targets || targets.length === 0) {
      throw new Error(`Gate ${gate} requires at least one target qubit.`);
    }

    for (const t of targets) {
      if (t < 0 || t >= numQubits) {
        throw new Error(`Target qubit ${t} out of range [0, ${numQubits - 1}].`);
      }
    }

    if (controls) {
      for (const c of controls) {
        if (c < 0 || c >= numQubits) {
          throw new Error(`Control qubit ${c} out of range [0, ${numQubits - 1}].`);
        }
        if (targets.includes(c)) {
          throw new Error(`Qubit ${c} cannot be both a control and a target.`);
        }
      }
    }

    if (gate === 'SWAP' && targets.length < 2) {
      throw new Error('SWAP gate requires 2 target qubits.');
    }
    if (gate === 'CCX' && (!controls || controls.length < 2)) {
      throw new Error('Toffoli (CCX) gate requires 2 control qubits.');
    }
  }

  /**
   * Applies a single GateOperation onto a QuantumState and returns the new QuantumState.
   */
  static applyOperation(state: QuantumState, op: GateOperation): QuantumState {
    this.validateOperation(state.numQubits, op);

    const { gate, targets, controls = [], params } = op;
    const n = state.numQubits;
    const sv = state.statevector.map(c => new ComplexNumber(c.real, c.imag));

    // Handle SWAP
    if (gate === 'SWAP') {
      const q1 = targets[0];
      const q2 = targets[1];
      const mask1 = 1 << (n - 1 - q1);
      const mask2 = 1 << (n - 1 - q2);

      for (let i = 0; i < state.dimension; i++) {
        // Swap only when bit1 == 1 and bit2 == 0 to avoid swapping twice
        if ((i & mask1) !== 0 && (i & mask2) === 0) {
          const j = (i ^ mask1) | mask2;
          const temp = sv[i];
          sv[i] = sv[j];
          sv[j] = temp;
        }
      }
      return new QuantumState(n, sv);
    }

    // Handle CSWAP (Fredkin)
    if (gate === 'CSWAP') {
      const c = controls[0];
      const q1 = targets[0];
      const q2 = targets[1];
      const cMask = 1 << (n - 1 - c);
      const mask1 = 1 << (n - 1 - q1);
      const mask2 = 1 << (n - 1 - q2);

      for (let i = 0; i < state.dimension; i++) {
        if ((i & cMask) !== 0 && (i & mask1) !== 0 && (i & mask2) === 0) {
          const j = (i ^ mask1) | mask2;
          const temp = sv[i];
          sv[i] = sv[j];
          sv[j] = temp;
        }
      }
      return new QuantumState(n, sv);
    }

    // Single-qubit or controlled single-qubit gate (e.g. X, H, Z, CX, CZ, CCX, Rx, etc.)
    const target = targets[0];
    let effectiveGate: GateType = gate;
    let effectiveControls = [...controls];

    if (gate === 'CX') {
      effectiveGate = 'X';
      if (controls.length === 0 && targets.length >= 2) {
        // [control, target] shorthand
        effectiveControls = [targets[0]];
        // target becomes targets[1]
        return this.applyOperation(state, {
          id: op.id,
          gate: 'X',
          targets: [targets[1]],
          controls: [targets[0]],
        });
      }
    } else if (gate === 'CZ') {
      effectiveGate = 'Z';
      if (controls.length === 0 && targets.length >= 2) {
        return this.applyOperation(state, {
          id: op.id,
          gate: 'Z',
          targets: [targets[1]],
          controls: [targets[0]],
        });
      }
    } else if (gate === 'CCX') {
      effectiveGate = 'X';
    }

    const matrix: Matrix2x2 = getGateMatrix2x2(effectiveGate, params);
    const [row0, row1] = matrix;
    const [u00, u01] = row0;
    const [u10, u11] = row1;

    const tMask = 1 << (n - 1 - target);

    // Prepare control mask check
    const requiredControlMask = effectiveControls.reduce((mask, c) => mask | (1 << (n - 1 - c)), 0);

    for (let i = 0; i < state.dimension; i++) {
      // Process each pair (i0, i1) where target bit is 0
      if ((i & tMask) === 0) {
        const i0 = i;
        const i1 = i | tMask;

        // Check if all control bits are 1
        if (effectiveControls.length === 0 || (i & requiredControlMask) === requiredControlMask) {
          const a0 = sv[i0];
          const a1 = sv[i1];

          // Butterfly: U * [a0, a1]^T
          // new_a0 = u00 * a0 + u01 * a1
          const newA0 = u00.mul(a0).add(u01.mul(a1));
          // new_a1 = u10 * a0 + u11 * a1
          const newA1 = u10.mul(a0).add(u11.mul(a1));

          sv[i0] = newA0;
          sv[i1] = newA1;
        }
      }
    }

    const newState = new QuantumState(n, sv);
    // Sanity check to avoid NaN propagation
    if (isNaN(newState.getTotalProbability())) {
      throw new Error(`Numerical instability error: Statevector contains NaN after applying gate ${gate}.`);
    }

    return newState;
  }

  /**
   * Applies an array of operations sequentially.
   */
  static executeCircuit(initialState: QuantumState, operations: GateOperation[]): QuantumState {
    let current = initialState;
    for (const op of operations) {
      current = this.applyOperation(current, op);
    }
    return current;
  }
}
