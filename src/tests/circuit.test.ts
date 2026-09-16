import { describe, it, expect } from 'vitest';
import { QuantumCircuit } from '../quantum/circuit';

describe('QuantumCircuit', () => {
  it('initializes with ground state snapshot', () => {
    const circuit = new QuantumCircuit(2);
    const snapshots = circuit.simulate();
    expect(snapshots).toHaveLength(1);
    expect(snapshots[0].probabilities[0]).toBeCloseTo(1.0);
    expect(snapshots[0].probabilities[1]).toBeCloseTo(0.0);
    expect(snapshots[0].probabilities[2]).toBeCloseTo(0.0);
    expect(snapshots[0].probabilities[3]).toBeCloseTo(0.0);
  });

  it('builds and executes Bell state (|00> + |11>)/sqrt(2)', () => {
    const circuit = new QuantumCircuit(2);
    circuit.addOperation({ id: 'h0', gate: 'H', targets: [0] });
    circuit.addOperation({ id: 'cx01', gate: 'CX', targets: [1], controls: [0] });

    const snapshots = circuit.simulate();
    expect(snapshots).toHaveLength(3);

    // Final snapshot: Bell state |Phi+>
    const finalSnap = snapshots[2];
    expect(finalSnap.probabilities[0]).toBeCloseTo(0.5); // |00>
    expect(finalSnap.probabilities[1]).toBeCloseTo(0.0); // |01>
    expect(finalSnap.probabilities[2]).toBeCloseTo(0.0); // |10>
    expect(finalSnap.probabilities[3]).toBeCloseTo(0.5); // |11>

    // Both qubits in Bell state have reduced density matrix = I/2 => Bloch vector length r ≈ 0
    expect(finalSnap.blochVectors[0].r).toBeLessThan(0.01);
    expect(finalSnap.blochVectors[1].r).toBeLessThan(0.01);
  });

  it('builds 3-qubit GHZ state (|000> + |111>)/sqrt(2)', () => {
    const circuit = new QuantumCircuit(3);
    circuit.addOperation({ id: 'h0', gate: 'H', targets: [0] });
    circuit.addOperation({ id: 'cx01', gate: 'CX', targets: [1], controls: [0] });
    circuit.addOperation({ id: 'cx12', gate: 'CX', targets: [2], controls: [1] });

    const snapshots = circuit.simulate();
    expect(snapshots).toHaveLength(4);
    const finalSnap = snapshots[3];

    expect(finalSnap.probabilities[0]).toBeCloseTo(0.5); // |000>
    expect(finalSnap.probabilities[7]).toBeCloseTo(0.5); // |111>
    for (let i = 1; i < 7; i++) {
      expect(finalSnap.probabilities[i]).toBeCloseTo(0.0);
    }
  });

  it('serializes and deserializes correctly', () => {
    const circuit = new QuantumCircuit(2);
    circuit.addOperation({ id: 'h0', gate: 'H', targets: [0] });
    circuit.addOperation({ id: 'x1', gate: 'X', targets: [1] });

    const json = circuit.serialize();
    const restored = QuantumCircuit.deserialize(json);

    expect(restored.numQubits).toBe(2);
    expect(restored.getAllOperations()).toHaveLength(2);
    expect(restored.getAllOperations()[0].gate).toBe('H');
    expect(restored.getAllOperations()[1].gate).toBe('X');
  });

  it('safely manages qubit additions and deletions', () => {
    const circuit = new QuantumCircuit(2);
    expect(circuit.addQubit()).toBe(true);
    expect(circuit.numQubits).toBe(3);

    // Cannot remove qubit if gates exist on it
    circuit.addOperation({ id: 'h2', gate: 'H', targets: [2] });
    expect(circuit.removeQubit()).toBe(false);
    expect(circuit.numQubits).toBe(3);

    // After removing gate, qubit can be safely removed
    circuit.removeOperation('h2');
    expect(circuit.removeQubit()).toBe(true);
    expect(circuit.numQubits).toBe(2);
  });
});
