import { describe, it, expect } from 'vitest';
import { QuantumState } from '../quantum/state';
import { QuantumEngine } from '../quantum/engine';
import { QuantumMeasurement } from '../quantum/measurement';

describe('Measurement & State Collapse', () => {
  it('correctly extracts theoretical probabilities for computational basis states', () => {
    let bell = QuantumState.zeroState(2);
    bell = QuantumEngine.applyOperation(bell, { id: 'h', gate: 'H', targets: [0] });
    bell = QuantumEngine.applyOperation(bell, { id: 'cx', gate: 'CX', targets: [1], controls: [0] });

    const probs = bell.getProbabilities();
    expect(probs[0]).toBeCloseTo(0.5); // |00>
    expect(probs[1]).toBeCloseTo(0.0); // |01>
    expect(probs[2]).toBeCloseTo(0.0); // |10>
    expect(probs[3]).toBeCloseTo(0.5); // |11>
  });

  it('collapses single qubit measurement and preserves normalization', () => {
    // Start with |+> = (|0> + |1>)/√2
    const plus = QuantumEngine.applyOperation(QuantumState.zeroState(1), { id: 'h', gate: 'H', targets: [0] });
    const result = QuantumMeasurement.measureSingleQubit(plus, 0);

    expect([0, 1]).toContain(result.outcome);
    expect(result.prob0).toBeCloseTo(0.5);
    expect(result.prob1).toBeCloseTo(0.5);

    // Collapsed state must be normalized
    expect(result.collapsedState.isNormalized()).toBe(true);

    if (result.outcome === 0) {
      expect(result.collapsedState.statevector[0].magnitudeSquared()).toBeCloseTo(1.0);
      expect(result.collapsedState.statevector[1].magnitudeSquared()).toBeCloseTo(0.0);
    } else {
      expect(result.collapsedState.statevector[0].magnitudeSquared()).toBeCloseTo(0.0);
      expect(result.collapsedState.statevector[1].magnitudeSquared()).toBeCloseTo(1.0);
    }
  });

  it('collapses Bell state to either |00⟩ or |11⟩ upon full system measurement', () => {
    let bell = QuantumState.zeroState(2);
    bell = QuantumEngine.applyOperation(bell, { id: 'h', gate: 'H', targets: [0] });
    bell = QuantumEngine.applyOperation(bell, { id: 'cx', gate: 'CX', targets: [1], controls: [0] });

    const m = QuantumMeasurement.measureFullSystem(bell);
    expect([0, 3]).toContain(m.outcomeIndex);
    expect(['|00⟩', '|11⟩']).toContain(m.basisString);
    expect(m.collapsedState.isNormalized()).toBe(true);

    // Verify incompatible states are zero
    const probs = m.collapsedState.getProbabilities();
    if (m.outcomeIndex === 0) {
      expect(probs[0]).toBeCloseTo(1.0);
      expect(probs[3]).toBeCloseTo(0.0);
    } else {
      expect(probs[0]).toBeCloseTo(0.0);
      expect(probs[3]).toBeCloseTo(1.0);
    }
  });

  it('runs multiple shots and matches theoretical probabilities within statistical bounds', () => {
    let bell = QuantumState.zeroState(2);
    bell = QuantumEngine.applyOperation(bell, { id: 'h', gate: 'H', targets: [0] });
    bell = QuantumEngine.applyOperation(bell, { id: 'cx', gate: 'CX', targets: [1], controls: [0] });

    const numShots = 2000;
    const shotResult = QuantumMeasurement.runShots(bell, numShots);
    expect(shotResult.totalShots).toBe(numShots);

    const count00 = shotResult.shots!['|00⟩'] || 0;
    const count11 = shotResult.shots!['|11⟩'] || 0;
    const count01 = shotResult.shots!['|01⟩'] || 0;
    const count10 = shotResult.shots!['|10⟩'] || 0;

    // Cross states must strictly be 0
    expect(count01).toBe(0);
    expect(count10).toBe(0);

    // With 2000 shots, frequency should be roughly 50% +/- 6% (3 standard deviations ≈ 3 * sqrt(0.25/2000) ≈ 3.3%)
    const freq00 = count00 / numShots;
    const freq11 = count11 / numShots;
    expect(freq00).toBeGreaterThan(0.42);
    expect(freq00).toBeLessThan(0.58);
    expect(freq11).toBeGreaterThan(0.42);
    expect(freq11).toBeLessThan(0.58);
  });
});
