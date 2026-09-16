import { IComplexNumber } from '../types/quantum';

/**
 * Standard numerical tolerance for quantum floating-point comparisons.
 */
export const EPSILON = 1e-10;

export class ComplexNumber implements IComplexNumber {
  public readonly real: number;
  public readonly imag: number;

  constructor(real: number, imag: number = 0) {
    // Clean up negative zero and negligible float noise
    this.real = Math.abs(real) < EPSILON ? 0 : real;
    this.imag = Math.abs(imag) < EPSILON ? 0 : imag;
  }

  static zero(): ComplexNumber {
    return new ComplexNumber(0, 0);
  }

  static one(): ComplexNumber {
    return new ComplexNumber(1, 0);
  }

  static i(): ComplexNumber {
    return new ComplexNumber(0, 1);
  }

  static fromPolar(r: number, theta: number): ComplexNumber {
    return new ComplexNumber(r * Math.cos(theta), r * Math.sin(theta));
  }

  static from(c: IComplexNumber): ComplexNumber {
    if (c instanceof ComplexNumber) return c;
    return new ComplexNumber(c.real, c.imag);
  }

  add(other: IComplexNumber | number): ComplexNumber {
    if (typeof other === 'number') {
      return new ComplexNumber(this.real + other, this.imag);
    }
    return new ComplexNumber(this.real + other.real, this.imag + other.imag);
  }

  sub(other: IComplexNumber | number): ComplexNumber {
    if (typeof other === 'number') {
      return new ComplexNumber(this.real - other, this.imag);
    }
    return new ComplexNumber(this.real - other.real, this.imag - other.imag);
  }

  mul(other: IComplexNumber | number): ComplexNumber {
    if (typeof other === 'number') {
      return new ComplexNumber(this.real * other, this.imag * other);
    }
    const r = this.real * other.real - this.imag * other.imag;
    const i = this.real * other.imag + this.imag * other.real;
    return new ComplexNumber(r, i);
  }

  div(other: IComplexNumber | number): ComplexNumber {
    if (typeof other === 'number') {
      if (Math.abs(other) < EPSILON) throw new Error('Division by zero in ComplexNumber');
      return new ComplexNumber(this.real / other, this.imag / other);
    }
    const denom = other.real * other.real + other.imag * other.imag;
    if (denom < EPSILON) throw new Error('Division by zero in ComplexNumber');
    const r = (this.real * other.real + this.imag * other.imag) / denom;
    const i = (this.imag * other.real - this.real * other.imag) / denom;
    return new ComplexNumber(r, i);
  }

  conj(): ComplexNumber {
    return new ComplexNumber(this.real, -this.imag);
  }

  magnitudeSquared(): number {
    return this.real * this.real + this.imag * this.imag;
  }

  magnitude(): number {
    return Math.sqrt(this.magnitudeSquared());
  }

  /**
   * Phase angle in radians in range (-π, π].
   */
  phase(): number {
    if (this.magnitudeSquared() < EPSILON * EPSILON) return 0;
    return Math.atan2(this.imag, this.real);
  }

  /**
   * Phase angle normalized in [0, 2π).
   */
  phasePositive(): number {
    const p = this.phase();
    return p < 0 ? p + 2 * Math.PI : p;
  }

  equals(other: IComplexNumber, tol: number = EPSILON): boolean {
    return Math.abs(this.real - other.real) <= tol && Math.abs(this.imag - other.imag) <= tol;
  }

  /**
   * Educational readable string representation (e.g., "0.707 + 0.707i", "1", "-i")
   */
  toString(precision: number = 4): string {
    const r = Math.abs(this.real) < EPSILON ? 0 : Number(this.real.toFixed(precision));
    const i = Math.abs(this.imag) < EPSILON ? 0 : Number(this.imag.toFixed(precision));

    if (i === 0) return `${r}`;
    if (r === 0) {
      if (i === 1) return 'i';
      if (i === -1) return '-i';
      return `${i}i`;
    }

    const sign = i > 0 ? '+' : '-';
    const absI = Math.abs(i);
    const iStr = absI === 1 ? 'i' : `${absI}i`;
    return `${r} ${sign} ${iStr}`;
  }
}
