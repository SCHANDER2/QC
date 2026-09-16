import { GateOperation } from '../types/quantum';
import { QuantumState } from './state';
import { GATE_DEFINITIONS } from './gates';
import { DensityMatrixUtils } from './density';

export interface EducationalExplanation {
  headline: string;
  beginnerNote: string;
  mathExplanation: string;
  matrixNote: string;
  entanglementNote?: string;
}

export class ExplanationEngine {
  /**
   * Generates natural language pedagogical explanations for the latest applied gate.
   */
  static explainOperation(
    op: GateOperation,
    _stateBefore: QuantumState,
    stateAfter: QuantumState
  ): EducationalExplanation {
    const def = GATE_DEFINITIONS[op.gate];
    const targetQ = op.targets[0];
    const controlQ = op.controls && op.controls.length > 0 ? op.controls[0] : null;

    let headline = `Applied ${def.name} on q${targetQ}`;
    let beginnerNote = def.explanation;
    let mathExplanation = def.mathExplanation;
    let matrixNote = `Unitary transformation U applied to statevector: |Ψ'⟩ = U |Ψ⟩.`;

    if (op.gate === 'H') {
      headline = `Hadamard on qubit q${targetQ}`;
      beginnerNote = `The Hadamard gate places qubit q${targetQ} into an equal superposition. If it was |0⟩, it is now (|0⟩ + |1⟩)/√2.`;
      mathExplanation = `H = 1/√2 [[1, 1], [1, -1]]. Notice both computational states now share equal 50% measurement likelihood.`;
    } else if (op.gate === 'X') {
      headline = `Pauli-X (NOT) on qubit q${targetQ}`;
      beginnerNote = `The X gate flips qubit q${targetQ} by 180° around the X-axis, swapping |0⟩ and |1⟩.`;
      mathExplanation = `X = [[0, 1], [1, 0]]. X |0⟩ = |1⟩, X |1⟩ = |0⟩.`;
    } else if (op.gate === 'Z') {
      headline = `Pauli-Z (Phase Flip) on qubit q${targetQ}`;
      beginnerNote = `The Z gate preserves the probabilities of |0⟩ and |1⟩, but inverts the quantum phase of |1⟩ to -|1⟩.`;
      mathExplanation = `Z = [[1, 0], [0, -1]]. Leaves |0⟩ unchanged; adds a 180° (π) relative phase to |1⟩.`;
    } else if (op.gate === 'CX' && controlQ !== null) {
      headline = `CNOT (Control: q${controlQ}, Target: q${targetQ})`;
      beginnerNote = `Qubit q${controlQ} acts as the control. Only when q${controlQ} is |1⟩ does the target q${targetQ} flip.`;
      mathExplanation = `CNOT |c, t⟩ = |c, t ⊕ c⟩. If control was in superposition, this operation entangles the two qubits!`;
    } else if (op.gate === 'SWAP' && op.targets.length >= 2) {
      headline = `SWAP between q${op.targets[0]} and q${op.targets[1]}`;
      beginnerNote = `The states of qubit q${op.targets[0]} and qubit q${op.targets[1]} have been completely exchanged.`;
      mathExplanation = `SWAP |a, b⟩ = |b, a⟩. Can be synthesized using three alternating CNOT gates.`;
    } else if (op.gate === 'CCX' && op.controls && op.controls.length >= 2) {
      headline = `Toffoli (CCNOT) on target q${targetQ}`;
      beginnerNote = `Target q${targetQ} is flipped if and only if both control qubits q${op.controls[0]} and q${op.controls[1]} are |1⟩.`;
      mathExplanation = `CCX |c1, c2, t⟩ = |c1, c2, t ⊕ (c1 · c2)⟩. A universal reversible classical gate.`;
    } else if (op.gate === 'Rx' || op.gate === 'Ry' || op.gate === 'Rz') {
      const angleDeg = Math.round((((op.params ? op.params[0] : 0) * 180) / Math.PI) * 100) / 100;
      headline = `${op.gate}(${angleDeg}°) on qubit q${targetQ}`;
      beginnerNote = `Rotated qubit q${targetQ} around the ${op.gate.slice(1)}-axis by ${angleDeg}°.`;
      mathExplanation = `${op.gate}(θ) continuously rotates the Bloch vector.`;
    }

    // Check for entanglement creation
    let entanglementNote: string | undefined;
    if (stateAfter.numQubits >= 2) {
      const b0 = DensityMatrixUtils.getBlochVector(stateAfter, 0);
      const b1 = DensityMatrixUtils.getBlochVector(stateAfter, 1);
      if (b0.r < 0.95 || b1.r < 0.95) {
        entanglementNote = `The qubits are in an entangled state. Notice the local Bloch vector radius r = ${b0.r.toFixed(3)} < 1.0. This state cannot be separated into independent single-qubit states; measuring one determines information about the other.`;
      }
    }

    return {
      headline,
      beginnerNote,
      mathExplanation,
      matrixNote,
      entanglementNote,
    };
  }
}
