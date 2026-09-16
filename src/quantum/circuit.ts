import { CircuitStep, GateOperation, SimulationSnapshot } from '../types/quantum';
import { QuantumState } from './state';
import { QuantumEngine } from './engine';
import { DensityMatrixUtils } from './density';
import { ExplanationEngine } from './explanation';

export class QuantumCircuit {
  public numQubits: number;
  public steps: CircuitStep[];

  constructor(numQubits: number = 2, steps: CircuitStep[] = []) {
    this.numQubits = Math.max(1, Math.min(8, numQubits));
    this.steps = steps;
  }

  static fromOperations(numQubits: number, operations: GateOperation[]): QuantumCircuit {
    const steps: CircuitStep[] = operations.map((op, idx) => ({
      stepIndex: idx,
      operations: [op],
    }));
    return new QuantumCircuit(numQubits, steps);
  }

  addQubit(): boolean {
    if (this.numQubits >= 8) return false;
    this.numQubits++;
    return true;
  }

  removeQubit(): boolean {
    if (this.numQubits <= 1) return false;
    const targetQ = this.numQubits - 1;
    const hasOpOnQubit = this.steps.some(step =>
      step.operations.some(op =>
        op.targets.includes(targetQ) || (op.controls && op.controls.includes(targetQ))
      )
    );
    if (hasOpOnQubit) return false;
    this.numQubits--;
    return true;
  }

  addOperation(op: GateOperation, stepIndex?: number): void {
    QuantumEngine.validateOperation(this.numQubits, op);

    if (stepIndex === undefined || stepIndex >= this.steps.length) {
      this.steps.push({
        stepIndex: this.steps.length,
        operations: [op],
      });
    } else {
      this.steps[stepIndex].operations.push(op);
    }
  }

  removeOperation(opId: string): boolean {
    let found = false;
    for (const step of this.steps) {
      const initLen = step.operations.length;
      step.operations = step.operations.filter(op => op.id !== opId);
      if (step.operations.length < initLen) {
        found = true;
      }
    }
    this.steps = this.steps.filter(s => s.operations.length > 0);
    this.steps.forEach((s, idx) => {
      s.stepIndex = idx;
    });
    return found;
  }

  clear(): void {
    this.steps = [];
  }

  getAllOperations(): GateOperation[] {
    const ops: GateOperation[] = [];
    for (const step of this.steps) {
      for (const op of step.operations) {
        ops.push(op);
      }
    }
    return ops;
  }

  /**
   * Simulates circuit from initial |0...0> state, recording snapshots at every gate.
   */
  simulate(): SimulationSnapshot[] {
    const snapshots: SimulationSnapshot[] = [];
    let currentState = QuantumState.zeroState(this.numQubits);

    snapshots.push({
      step: 0,
      gateDescription: 'Initial Ground State |0...0⟩',
      statevector: currentState.statevector,
      probabilities: currentState.getProbabilities(),
      blochVectors: DensityMatrixUtils.getAllBlochVectors(currentState),
      explanation: `System initialized to |${'0'.repeat(this.numQubits)}⟩ ground state.`,
      mathNotes: 'Ground state vector: [1, 0, ..., 0]^T',
    });

    const allOps = this.getAllOperations();
    for (let i = 0; i < allOps.length; i++) {
      const op = allOps[i];
      const stateBefore = currentState;
      currentState = QuantumEngine.applyOperation(currentState, op);
      const explanation = ExplanationEngine.explainOperation(op, stateBefore, currentState);

      snapshots.push({
        step: i + 1,
        gateDescription: explanation.headline,
        statevector: currentState.statevector,
        probabilities: currentState.getProbabilities(),
        blochVectors: DensityMatrixUtils.getAllBlochVectors(currentState),
        explanation: explanation.beginnerNote + (explanation.entanglementNote ? ' ' + explanation.entanglementNote : ''),
        mathNotes: explanation.mathExplanation,
      });
    }

    return snapshots;
  }

  serialize(): string {
    return JSON.stringify({
      numQubits: this.numQubits,
      ops: this.getAllOperations(),
    });
  }

  static deserialize(jsonStr: string): QuantumCircuit {
    try {
      const data = JSON.parse(jsonStr);
      const circuit = new QuantumCircuit(data.numQubits || 2);
      if (Array.isArray(data.ops)) {
        data.ops.forEach((op: GateOperation) => {
          circuit.addOperation(op);
        });
      }
      return circuit;
    } catch {
      return new QuantumCircuit(2);
    }
  }
}
