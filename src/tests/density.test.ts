import { describe, it, expect } from 'vitest';
import { QuantumState } from '../quantum/state';
import { QuantumEngine } from '../quantum/engine';
import { DensityMatrixUtils } from '../quantum/density';
import { ComplexNumber } from '../quantum/complex';

describe('Reduced Density Matrix, Partial Trace & Bloch Vectors', () => {
  it('computes exact Bloch coordinates for single-qubit pure basis states', () => {
    // |0>: North pole (0, 0, 1)
    const s0 = QuantumState.zeroState(1);
    const b0 = DensityMatrixUtils.getBlochVector(s0, 0);
    expect(b0.x).toBeCloseTo(0);
    expect(b0.y).toBeCloseTo(0);
    expect(b0.z).toBeCloseTo(1);
    expect(b0.r).toBeCloseTo(1);
    expect(b0.purity).toBeCloseTo(1);

    // |1>: South pole (0, 0, -1)
    const s1 = QuantumEngine.applyOperation(s0, { id: 'x', gate: 'X', targets: [0] });
    const b1 = DensityMatrixUtils.getBlochVector(s1, 0);
    expect(b1.x).toBeCloseTo(0);
    expect(b1.y).toBeCloseTo(0);
    expect(b1.z).toBeCloseTo(-1);
    expect(b1.r).toBeCloseTo(1);

    // |+>: Positive X axis (1, 0, 0)
    const sPlus = QuantumEngine.applyOperation(s0, { id: 'h', gate: 'H', targets: [0] });
    const bPlus = DensityMatrixUtils.getBlochVector(sPlus, 0);
    expect(bPlus.x).toBeCloseTo(1);
    expect(bPlus.y).toBeCloseTo(0);
    expect(bPlus.z).toBeCloseTo(0);
    expect(bPlus.r).toBeCloseTo(1);

    // |->: Negative X axis (-1, 0, 0)
    const sMinus = QuantumEngine.applyOperation(sPlus, { id: 'z', gate: 'Z', targets: [0] });
    const bMinus = DensityMatrixUtils.getBlochVector(sMinus, 0);
    expect(bMinus.x).toBeCloseTo(-1);
    expect(bMinus.y).toBeCloseTo(0);
    expect(bMinus.z).toBeCloseTo(0);
    expect(bMinus.r).toBeCloseTo(1);

    // |+i>: Positive Y axis (0, 1, 0)
    const sPlusI = QuantumEngine.applyOperation(sPlus, { id: 's', gate: 'S', targets: [0] });
    const bPlusI = DensityMatrixUtils.getBlochVector(sPlusI, 0);
    expect(bPlusI.x).toBeCloseTo(0);
    expect(bPlusI.y).toBeCloseTo(1);
    expect(bPlusI.z).toBeCloseTo(0);
    expect(bPlusI.r).toBeCloseTo(1);
  });

  it('verifies global phase invariance of Bloch vector', () => {
    // State |+> with global phase exp(i * pi / 3)
    const phaseFactor = ComplexNumber.fromPolar(1, Math.PI / 3);
    const alpha = new ComplexNumber(Math.SQRT1_2, 0).mul(phaseFactor);
    const beta = new ComplexNumber(Math.SQRT1_2, 0).mul(phaseFactor);
    const phasedPlus = new QuantumState(1, [alpha, beta]);

    const b = DensityMatrixUtils.getBlochVector(phasedPlus, 0);
    expect(b.x).toBeCloseTo(1.0);
    expect(b.y).toBeCloseTo(0.0);
    expect(b.z).toBeCloseTo(0.0);
    expect(b.r).toBeCloseTo(1.0);
  });

  it('proves that local reduced states of Bell state are maximally mixed at the origin (r=0)', () => {
    // Prepare Bell state (|00> + |11>)/√2
    let bell = QuantumState.zeroState(2);
    bell = QuantumEngine.applyOperation(bell, { id: '1', gate: 'H', targets: [0] });
    bell = QuantumEngine.applyOperation(bell, { id: '2', gate: 'CX', targets: [1], controls: [0] });

    const b0 = DensityMatrixUtils.getBlochVector(bell, 0);
    const b1 = DensityMatrixUtils.getBlochVector(bell, 1);

    // Both reduced states have x=0, y=0, z=0, r=0, purity=0.5 and maximal entropy 1.0 ebit!
    expect(b0.x).toBeCloseTo(0.0);
    expect(b0.y).toBeCloseTo(0.0);
    expect(b0.z).toBeCloseTo(0.0);
    expect(b0.r).toBeCloseTo(0.0);
    expect(b0.purity).toBeCloseTo(0.5);
    expect(b0.entropy).toBeCloseTo(1.0);

    expect(b1.x).toBeCloseTo(0.0);
    expect(b1.y).toBeCloseTo(0.0);
    expect(b1.z).toBeCloseTo(0.0);
    expect(b1.r).toBeCloseTo(0.0);
    expect(b1.purity).toBeCloseTo(0.5);
    expect(b1.entropy).toBeCloseTo(1.0);
  });

  it('keeps product state local Bloch vectors on the unit sphere (r=1, entropy=0)', () => {
    // |0> on q0, |+> on q1
    let state = QuantumState.zeroState(2);
    state = QuantumEngine.applyOperation(state, { id: 'h1', gate: 'H', targets: [1] });

    const b0 = DensityMatrixUtils.getBlochVector(state, 0);
    const b1 = DensityMatrixUtils.getBlochVector(state, 1);

    // q0 is pure |0> -> (0, 0, 1), r = 1, entropy = 0
    expect(b0.z).toBeCloseTo(1.0);
    expect(b0.r).toBeCloseTo(1.0);
    expect(b0.entropy).toBeCloseTo(0.0);

    // q1 is pure |+> -> (1, 0, 0), r = 1, entropy = 0
    expect(b1.x).toBeCloseTo(1.0);
    expect(b1.r).toBeCloseTo(1.0);
    expect(b1.entropy).toBeCloseTo(0.0);
  });
});
