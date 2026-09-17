import { GateOperation } from '../types/quantum';

export class QasmExporter {
  /**
   * Exports circuit operations to standard OpenQASM 2.0 code compatible with IBM Qiskit.
   */
  static toOpenQASM(numQubits: number, operations: GateOperation[]): string {
    const lines: string[] = [
      'OPENQASM 2.0;',
      'include "qelib1.inc";',
      '',
      `qreg q[${numQubits}];`,
      `creg c[${numQubits}];`,
      '',
    ];

    for (const op of operations) {
      const t = op.targets;
      const c = op.controls || [];
      const p = op.params || [];

      switch (op.gate) {
        case 'I':
          lines.push(`id q[${t[0]}];`);
          break;
        case 'X':
          if (c.length === 0) lines.push(`x q[${t[0]}];`);
          else if (c.length === 1) lines.push(`cx q[${c[0]}],q[${t[0]}];`);
          else if (c.length === 2) lines.push(`ccx q[${c[0]}],q[${c[1]}],q[${t[0]}];`);
          break;
        case 'Y':
          lines.push(`y q[${t[0]}];`);
          break;
        case 'Z':
          if (c.length === 0) lines.push(`z q[${t[0]}];`);
          else if (c.length === 1) lines.push(`cz q[${c[0]}],q[${t[0]}];`);
          break;
        case 'H':
          lines.push(`h q[${t[0]}];`);
          break;
        case 'S':
          lines.push(`s q[${t[0]}];`);
          break;
        case 'Sdg':
          lines.push(`sdg q[${t[0]}];`);
          break;
        case 'T':
          lines.push(`t q[${t[0]}];`);
          break;
        case 'Tdg':
          lines.push(`tdg q[${t[0]}];`);
          break;
        case 'Rx':
          lines.push(`rx(${p[0]?.toFixed(4) || '1.5708'}) q[${t[0]}];`);
          break;
        case 'Ry':
          lines.push(`ry(${p[0]?.toFixed(4) || '1.5708'}) q[${t[0]}];`);
          break;
        case 'Rz':
          lines.push(`rz(${p[0]?.toFixed(4) || '1.5708'}) q[${t[0]}];`);
          break;
        case 'Phase':
          lines.push(`u1(${p[0]?.toFixed(4) || '1.5708'}) q[${t[0]}];`);
          break;
        case 'CX':
          lines.push(`cx q[${c[0] ?? t[0]}],q[${t[1] ?? t[0]}];`);
          break;
        case 'CZ':
          lines.push(`cz q[${c[0] ?? t[0]}],q[${t[1] ?? t[0]}];`);
          break;
        case 'SWAP':
          lines.push(`swap q[${t[0]}],q[${t[1]}];`);
          break;
        case 'CCX':
          lines.push(`ccx q[${c[0]}],q[${c[1]}],q[${t[0]}];`);
          break;
        default:
          lines.push(`// Custom gate ${op.gate} on q[${t.join(', ')}]`);
          break;
      }
    }

    lines.push('');
    lines.push('measure q -> c;');
    return lines.join('\n');
  }

  /**
   * Exports circuit to plain ASCII diagram representation.
   */
  static toAsciiDiagram(numQubits: number, operations: GateOperation[]): string {
    const wireLines: string[] = Array.from({ length: numQubits }, (_, q) => `q${q}: `);

    for (const op of operations) {
      const maxLen = Math.max(...wireLines.map(l => l.length));
      for (let q = 0; q < numQubits; q++) {
        wireLines[q] = wireLines[q].padEnd(maxLen, '─');
      }

      for (let q = 0; q < numQubits; q++) {
        if (op.controls && op.controls.includes(q)) {
          wireLines[q] += '──■──';
        } else if (op.targets.includes(q)) {
          if (op.gate === 'CX') wireLines[q] += '──⊕──';
          else if (op.gate === 'SWAP') wireLines[q] += '──✕──';
          else wireLines[q] += `─[${op.gate}]─`;
        } else {
          wireLines[q] += '─────';
        }
      }
    }

    const finalLen = Math.max(...wireLines.map(l => l.length));
    for (let q = 0; q < numQubits; q++) {
      wireLines[q] = wireLines[q].padEnd(finalLen, '─') + '─';
    }

    return wireLines.join('\n');
  }
}
