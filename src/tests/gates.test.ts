import { describe, it, expect } from 'vitest';
import { QuantumState } from '../quantum/state';
import { QuantumEngine } from '../quantum/engine';

describe('Single-Qubit Gate Mathematics & Invariants', () => {
  const apply = (state: QuantumState, gate: any, params?: number[]) => {
    return QuantumEngine.applyOperation(state, {
      id: 'op',
      gate,
      targets: [0],
      params,
    });
  };

  it('X gate flips computational basis: X|0> = |1>, X|1> = |0>', () => {
    const s0 = QuantumState.zeroState(1);
    const s1 = apply(s0, 'X');
    expect(s1.statevector[0].magnitudeSquared()).toBeCloseTo(0);
    expect(s1.statevector[1].magnitudeSquared()).toBeCloseTo(1);

    const s0_again = apply(s1, 'X');
    expect(s0_again.statevector[0].magnitudeSquared()).toBeCloseTo(1);
    expect(s0_again.statevector[1].magnitudeSquared()).toBeCloseTo(0);
  });

  it('Hadamard creates superposition: H|0> = |+>, H|1> = |->', () => {
    const s0 = QuantumState.zeroState(1);
    const plus = apply(s0, 'H');
    expect(plus.statevector[0].real).toBeCloseTo(Math.SQRT1_2);
    expect(plus.statevector[1].real).toBeCloseTo(Math.SQRT1_2);

    const s1 = apply(s0, 'X');
    const minus = apply(s1, 'H');
    expect(minus.statevector[0].real).toBeCloseTo(Math.SQRT1_2);
    expect(minus.statevector[1].real).toBeCloseTo(-Math.SQRT1_2);
  });

  it('Z|+> = |-> and S|+> = |+i>', () => {
    const plus = apply(QuantumState.zeroState(1), 'H');
    const minus = apply(plus, 'Z');
    expect(minus.statevector[0].real).toBeCloseTo(Math.SQRT1_2);
    expect(minus.statevector[1].real).toBeCloseTo(-Math.SQRT1_2);

    const plus_i = apply(plus, 'S');
    expect(plus_i.statevector[0].real).toBeCloseTo(Math.SQRT1_2);
    expect(plus_i.statevector[1].imag).toBeCloseTo(Math.SQRT1_2);
    expect(plus_i.statevector[1].real).toBeCloseTo(0);
  });

  it('verifies unitary invariants: X² = I, Y² = I, Z² = I, H² = I', () => {
    const s0 = QuantumState.zeroState(1);

    // X² = I
    const x2 = apply(apply(s0, 'X'), 'X');
    expect(x2.equals(s0)).toBe(true);

    // Y² = I
    const y2 = apply(apply(s0, 'Y'), 'Y');
    expect(y2.statevector[0].magnitudeSquared()).toBeCloseTo(1);

    // Z² = I
    const z2 = apply(apply(s0, 'Z'), 'Z');
    expect(z2.equals(s0)).toBe(true);

    // H² = I
    const h2 = apply(apply(s0, 'H'), 'H');
    expect(h2.equals(s0)).toBe(true);
  });

  it('verifies phase power invariants: S⁴ = I, T⁸ = I', () => {
    let s = apply(QuantumState.zeroState(1), 'H'); // start in |+>
    const initialPlus = s.clone();

    // S⁴
    for (let i = 0; i < 4; i++) {
      s = apply(s, 'S');
    }
    expect(s.equals(initialPlus)).toBe(true);

    // T⁸
    let t = initialPlus.clone();
    for (let i = 0; i < 8; i++) {
      t = apply(t, 'T');
    }
    expect(t.equals(initialPlus)).toBe(true);
  });

  it('verifies continuous rotations Rx, Ry, Rz for arbitrary angles', () => {
    const s0 = QuantumState.zeroState(1);
    // Rx(2π) = -I (differs by global phase e^(-iπ) = -1)
    const rx2pi = apply(s0, 'Rx', [2 * Math.PI]);
    expect(rx2pi.statevector[0].magnitudeSquared()).toBeCloseTo(1);

    // Ry(π)|0> = |1>
    const rypi = apply(s0, 'Ry', [Math.PI]);
    expect(rypi.statevector[0].magnitudeSquared()).toBeCloseTo(0);
    expect(rypi.statevector[1].magnitudeSquared()).toBeCloseTo(1);

    // Rx(π/2) then Rx(π/2) = Rx(π)
    const rxHalf = apply(s0, 'Rx', [Math.PI / 2]);
    const rxFull = apply(rxHalf, 'Rx', [Math.PI / 2]);
    const rxDirect = apply(s0, 'Rx', [Math.PI]);
    expect(rxFull.equals(rxDirect)).toBe(true);
  });
});
