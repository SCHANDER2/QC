import { describe, it, expect } from 'vitest';
import { ComplexNumber } from '../quantum/complex';

describe('ComplexNumber Mathematics', () => {
  it('creates zero, one, and imaginary unit correctly', () => {
    const zero = ComplexNumber.zero();
    const one = ComplexNumber.one();
    const i = ComplexNumber.i();

    expect(zero.real).toBe(0);
    expect(zero.imag).toBe(0);
    expect(one.real).toBe(1);
    expect(one.imag).toBe(0);
    expect(i.real).toBe(0);
    expect(i.imag).toBe(1);
  });

  it('performs addition and subtraction', () => {
    const a = new ComplexNumber(3, 4);
    const b = new ComplexNumber(1, -2);

    const sum = a.add(b);
    expect(sum.real).toBeCloseTo(4);
    expect(sum.imag).toBeCloseTo(2);

    const diff = a.sub(b);
    expect(diff.real).toBeCloseTo(2);
    expect(diff.imag).toBeCloseTo(6);
  });

  it('performs complex multiplication (i * i = -1)', () => {
    const i = ComplexNumber.i();
    const product = i.mul(i);

    expect(product.real).toBeCloseTo(-1);
    expect(product.imag).toBeCloseTo(0);
  });

  it('performs complex division correctly', () => {
    // (1 + 2i) / (1 + i) = (1+2i)(1-i)/2 = (1 - i + 2i + 2)/2 = (3 + i)/2 = 1.5 + 0.5i
    const a = new ComplexNumber(1, 2);
    const b = new ComplexNumber(1, 1);
    const quotient = a.div(b);

    expect(quotient.real).toBeCloseTo(1.5);
    expect(quotient.imag).toBeCloseTo(0.5);
  });

  it('computes magnitude and magnitude squared', () => {
    const c = new ComplexNumber(3, 4);
    expect(c.magnitudeSquared()).toBeCloseTo(25);
    expect(c.magnitude()).toBeCloseTo(5);
  });

  it('computes phase correctly across four quadrants', () => {
    const c1 = new ComplexNumber(1, 1); // 45 deg = pi/4
    expect(c1.phase()).toBeCloseTo(Math.PI / 4);

    const c2 = new ComplexNumber(-1, 1); // 135 deg = 3pi/4
    expect(c2.phase()).toBeCloseTo((3 * Math.PI) / 4);

    const c3 = new ComplexNumber(-1, -1); // -135 deg = -3pi/4
    expect(c3.phase()).toBeCloseTo((-3 * Math.PI) / 4);
    expect(c3.phasePositive()).toBeCloseTo((5 * Math.PI) / 4);
  });

  it('computes complex conjugate', () => {
    const c = new ComplexNumber(2, 5);
    const conj = c.conj();
    expect(conj.real).toBeCloseTo(2);
    expect(conj.imag).toBeCloseTo(-5);
  });

  it('converts to formatted educational string', () => {
    expect(new ComplexNumber(0.7071, 0).toString(3)).toBe('0.707');
    expect(new ComplexNumber(0, 1).toString()).toBe('i');
    expect(new ComplexNumber(0, -1).toString()).toBe('-i');
    expect(new ComplexNumber(0.5, 0.5).toString(2)).toBe('0.5 + 0.5i');
    expect(new ComplexNumber(0.5, -0.5).toString(2)).toBe('0.5 - 0.5i');
  });
});
