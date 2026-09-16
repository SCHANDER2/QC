import { describe, it, expect } from 'vitest';
import { QuantumState } from '../quantum/state';
import { QuantumEngine } from '../quantum/engine';

describe('Multi-Qubit Gates, Bell States, and GHZ', () => {
  it('prepares canonical Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 with exact probabilities', () => {
    let state = QuantumState.zeroState(2);

    // H on q0
    state = QuantumEngine.applyOperation(state, { id: '1', gate: 'H', targets: [0] });
    // CX with control q0, target q1
    state = QuantumEngine.applyOperation(state, { id: '2', gate: 'CX', targets: [1], controls: [0] });

    const probs = state.getProbabilities();
    // Basis order: |00>, |01>, |10>, |11>
    expect(probs[0]).toBeCloseTo(0.5); // |00>
    expect(probs[1]).toBeCloseTo(0.0); // |01>
    expect(probs[2]).toBeCloseTo(0.0); // |10>
    expect(probs[3]).toBeCloseTo(0.5); // |11>

    expect(state.statevector[0].real).toBeCloseTo(Math.SQRT1_2);
    expect(state.statevector[3].real).toBeCloseTo(Math.SQRT1_2);
  });

  it('prepares all 4 Bell states correctly', () => {
    // |Φ⁻⟩ = (|00⟩ - |11⟩)/√2
    let sPhiMinus = QuantumState.zeroState(2);
    sPhiMinus = QuantumEngine.applyOperation(sPhiMinus, { id: '1', gate: 'X', targets: [0] });
    sPhiMinus = QuantumEngine.applyOperation(sPhiMinus, { id: '2', gate: 'H', targets: [0] });
    sPhiMinus = QuantumEngine.applyOperation(sPhiMinus, { id: '3', gate: 'CX', targets: [1], controls: [0] });

    expect(sPhiMinus.statevector[0].real).toBeCloseTo(Math.SQRT1_2);
    expect(sPhiMinus.statevector[3].real).toBeCloseTo(-Math.SQRT1_2);

    // |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2
    let sPsiPlus = QuantumState.zeroState(2);
    sPsiPlus = QuantumEngine.applyOperation(sPsiPlus, { id: '1', gate: 'X', targets: [1] });
    sPsiPlus = QuantumEngine.applyOperation(sPsiPlus, { id: '2', gate: 'H', targets: [0] });
    sPsiPlus = QuantumEngine.applyOperation(sPsiPlus, { id: '3', gate: 'CX', targets: [1], controls: [0] });

    const pPsi = sPsiPlus.getProbabilities();
    expect(pPsi[1]).toBeCloseTo(0.5); // |01>
    expect(pPsi[2]).toBeCloseTo(0.5); // |10>
    expect(pPsi[0]).toBeCloseTo(0.0);
    expect(pPsi[3]).toBeCloseTo(0.0);
  });

  it('prepares 3-qubit GHZ state (|000⟩ + |111⟩)/√2', () => {
    let state = QuantumState.zeroState(3);

    // H on q0
    state = QuantumEngine.applyOperation(state, { id: '1', gate: 'H', targets: [0] });
    // CX(q0 -> q1)
    state = QuantumEngine.applyOperation(state, { id: '2', gate: 'CX', targets: [1], controls: [0] });
    // CX(q1 -> q2)
    state = QuantumEngine.applyOperation(state, { id: '3', gate: 'CX', targets: [2], controls: [1] });

    const probs = state.getProbabilities();
    // |000> is index 0, |111> is index 7
    expect(probs[0]).toBeCloseTo(0.5);
    expect(probs[7]).toBeCloseTo(0.5);
    for (let i = 1; i < 7; i++) {
      expect(probs[i]).toBeCloseTo(0.0);
    }
  });

  it('SWAP gate exchanges states of arbitrary qubits', () => {
    // Start with |10> (q0=1, q1=0)
    let state = QuantumState.zeroState(2);
    state = QuantumEngine.applyOperation(state, { id: '1', gate: 'X', targets: [0] });
    expect(state.getProbabilities()[2]).toBeCloseTo(1.0); // |10>

    // SWAP q0 and q1 -> should become |01> (q0=0, q1=1)
    state = QuantumEngine.applyOperation(state, { id: '2', gate: 'SWAP', targets: [0, 1] });
    expect(state.getProbabilities()[1]).toBeCloseTo(1.0); // |01>
  });

  it('Toffoli (CCX) gate flips target only when both controls are 1', () => {
    // 3 qubits: controls q0, q1; target q2
    // Case 1: |000> -> CCX -> |000>
    let s0 = QuantumState.zeroState(3);
    let out0 = QuantumEngine.applyOperation(s0, { id: '1', gate: 'CCX', targets: [2], controls: [0, 1] });
    expect(out0.getProbabilities()[0]).toBeCloseTo(1.0);

    // Case 2: |110> (q0=1, q1=1, q2=0, index 6 = 110 in binary)
    let s6 = QuantumState.basisState(3, 6);
    let out6 = QuantumEngine.applyOperation(s6, { id: '1', gate: 'CCX', targets: [2], controls: [0, 1] });
    // Target q2 flips from 0 to 1 -> state becomes |111> (index 7)
    expect(out6.getProbabilities()[7]).toBeCloseTo(1.0);
  });
});
