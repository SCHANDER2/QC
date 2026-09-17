import { describe, it, expect } from 'vitest';
import { QasmExporter } from '../quantum/qasm';

describe('QasmExporter', () => {
  it('exports Bell state circuit to valid OpenQASM 2.0', () => {
    const qasm = QasmExporter.toOpenQASM(2, [
      { id: '1', gate: 'H', targets: [0] },
      { id: '2', gate: 'CX', targets: [1], controls: [0] },
    ]);

    expect(qasm).toContain('OPENQASM 2.0;');
    expect(qasm).toContain('qreg q[2];');
    expect(qasm).toContain('h q[0];');
    expect(qasm).toContain('cx q[0],q[1];');
    expect(qasm).toContain('measure q -> c;');
  });

  it('exports clean ASCII circuit diagram', () => {
    const ascii = QasmExporter.toAsciiDiagram(2, [
      { id: '1', gate: 'H', targets: [0] },
      { id: '2', gate: 'CX', targets: [1], controls: [0] },
    ]);

    expect(ascii).toContain('q0:');
    expect(ascii).toContain('[H]');
    expect(ascii).toContain('q1:');
    expect(ascii).toContain('⊕');
  });
});
