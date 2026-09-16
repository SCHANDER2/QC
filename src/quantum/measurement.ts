import { ComplexNumber } from './complex';
import { QuantumState } from './state';
import { MeasurementResult } from '../types/quantum';

export class QuantumMeasurement {
  /**
   * Samples a random index according to the given discrete probability distribution.
   */
  static sampleDistribution(probabilities: number[]): number {
    const r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (r <= cumulative || i === probabilities.length - 1) {
        return i;
      }
    }
    return probabilities.length - 1;
  }

  /**
   * Performs full-system projective measurement in computational basis.
   * Returns outcome and collapsed quantum state.
   */
  static measureFullSystem(state: QuantumState): { outcomeIndex: number; basisString: string; collapsedState: QuantumState } {
    const probs = state.getProbabilities();
    const outcomeIndex = this.sampleDistribution(probs);
    const basisString = outcomeIndex.toString(2).padStart(state.numQubits, '0');
    const collapsedState = QuantumState.basisState(state.numQubits, outcomeIndex);

    return {
      outcomeIndex,
      basisString: `|${basisString}⟩`,
      collapsedState,
    };
  }

  /**
   * Performs measurement on a single target qubit, returning the 0 or 1 outcome
   * and the post-measurement collapsed quantum state.
   */
  static measureSingleQubit(
    state: QuantumState,
    targetQubit: number
  ): { outcome: 0 | 1; prob0: number; prob1: number; collapsedState: QuantumState } {
    const n = state.numQubits;
    if (targetQubit < 0 || targetQubit >= n) {
      throw new Error(`Target qubit ${targetQubit} out of range [0, ${n - 1}].`);
    }

    const tMask = 1 << (n - 1 - targetQubit);
    let prob0 = 0;
    let prob1 = 0;

    for (let i = 0; i < state.dimension; i++) {
      const p = state.statevector[i].magnitudeSquared();
      if ((i & tMask) === 0) {
        prob0 += p;
      } else {
        prob1 += p;
      }
    }

    const outcome: 0 | 1 = Math.random() < prob0 ? 0 : 1;
    const survivingSv: ComplexNumber[] = [];

    for (let i = 0; i < state.dimension; i++) {
      const bit = (i & tMask) === 0 ? 0 : 1;
      if (bit === outcome) {
        survivingSv.push(state.statevector[i]);
      } else {
        survivingSv.push(ComplexNumber.zero());
      }
    }

    const collapsedState = new QuantumState(n, survivingSv).normalize();

    return {
      outcome,
      prob0,
      prob1,
      collapsedState,
    };
  }

  /**
   * Simulates repeated measurement shots without collapsing the primary state.
   * Returns a histogram count mapping (e.g. { "|00>": 512, "|11>": 488 }).
   */
  static runShots(state: QuantumState, numShots: number = 1024): MeasurementResult {
    const probs = state.getProbabilities();
    const shotsCount: { [basis: string]: number } = {};
    const n = state.numQubits;

    // Initialize all basis keys with 0
    for (let i = 0; i < state.dimension; i++) {
      const bStr = `|${i.toString(2).padStart(n, '0')}⟩`;
      shotsCount[bStr] = 0;
    }

    // Cumulative distribution table for fast binary search sampling
    const cumulativeProbs: number[] = new Array(probs.length);
    let running = 0;
    for (let i = 0; i < probs.length; i++) {
      running += probs[i];
      cumulativeProbs[i] = running;
    }

    let lastSample = 0;
    for (let s = 0; s < numShots; s++) {
      const r = Math.random();
      // Binary search
      let low = 0;
      let high = cumulativeProbs.length - 1;
      let selected = high;

      while (low <= high) {
        const mid = (low + high) >> 1;
        if (cumulativeProbs[mid] >= r) {
          selected = mid;
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }

      lastSample = selected;
      const bStr = `|${selected.toString(2).padStart(n, '0')}⟩`;
      shotsCount[bStr] = (shotsCount[bStr] || 0) + 1;
    }

    const basisOutcome = `|${lastSample.toString(2).padStart(n, '0')}⟩`;

    return {
      basisOutcome,
      indexOutcome: lastSample,
      probabilities: probs,
      shots: shotsCount,
      totalShots: numShots,
      timestamp: Date.now(),
    };
  }
}
