import { describe, it, expect } from 'vitest';
import { QuantumState } from '../quantum/state';
import { ComplexNumber } from '../quantum/complex';

describe('QuantumState Abstraction & Basis Order', () => {
  it('creates ground state |0...0> and maintains normalization Σ |a_i|² = 1', () => {
    for (let n = 1; n <= 4; n++) {
      const state = QuantumState.zeroState(n);
      expect(state.dimension).toBe(1 << n);
      expect(state.getTotalProbability()).toBeCloseTo(1.0);
      expect(state.isNormalized()).toBe(true);
      expect(state.statevector[0].real).toBeCloseTo(1.0);
      for (let i = 1; i < state.dimension; i++) {
        expect(state.statevector[i].magnitudeSquared()).toBeCloseTo(0);
      }
    }
  });

  it('strictly adheres to the locked basis convention |q0 q1 ... q(n-1)>', () => {
    // For 2 qubits:
    // index 0 -> |00> (q0=0, q1=0)
    // index 1 -> |01> (q0=0, q1=1)
    // index 2 -> |10> (q0=1, q1=0)
    // index 3 -> |11> (q0=1, q1=1)
    const state2 = QuantumState.zeroState(2);
    expect(state2.getQubitBit(0, 0)).toBe(0);
    expect(state2.getQubitBit(0, 1)).toBe(0);

    expect(state2.getQubitBit(1, 0)).toBe(0);
    expect(state2.getQubitBit(1, 1)).toBe(1);

    expect(state2.getQubitBit(2, 0)).toBe(1);
    expect(state2.getQubitBit(2, 1)).toBe(0);

    expect(state2.getQubitBit(3, 0)).toBe(1);
    expect(state2.getQubitBit(3, 1)).toBe(1);

    // Check amplitude basis string generation
    const amps = state2.getAmplitudes();
    expect(amps[0].basis).toBe('|00⟩');
    expect(amps[1].basis).toBe('|01⟩');
    expect(amps[2].basis).toBe('|10⟩');
    expect(amps[3].basis).toBe('|11⟩');
  });

  it('correctly maps 3-qubit basis order', () => {
    // 3 qubits: |000> to |111>
    const state3 = QuantumState.zeroState(3);
    const amps = state3.getAmplitudes();
    const expected = ['|000⟩', '|001⟩', '|010⟩', '|011⟩', '|100⟩', '|101⟩', '|110⟩', '|111⟩'];
    for (let i = 0; i < 8; i++) {
      expect(amps[i].basis).toBe(expected[i]);
    }
  });

  it('normalizes arbitrary unnormalized state and throws on zero norm', () => {
    const rawAmps = [new ComplexNumber(3, 0), new ComplexNumber(4, 0)];
    const state = QuantumState.fromAmplitudes(1, rawAmps);
    expect(state.isNormalized()).toBe(true);
    expect(state.statevector[0].real).toBeCloseTo(0.6);
    expect(state.statevector[1].real).toBeCloseTo(0.8);

    expect(() => {
      QuantumState.fromAmplitudes(1, [ComplexNumber.zero(), ComplexNumber.zero()]);
    }).toThrow();
  });
});
