/**
 * Deterministic Pseudo-Random Number Generator (Mulberry32)
 * Ensures every environment generates the exact same realistic synthetic dataset.
 */

export class SeededRNG {
  private state: number;

  constructor(seed: number = 424242) {
    this.state = seed;
  }

  /** Returns a float in [0, 1) */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns an integer in [min, max] inclusive */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Returns a float in [min, max] */
  nextFloat(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Picks an element from an array based on uniform probability */
  pick<T>(items: T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  /** Picks an element based on weighted probabilities */
  pickWeighted<T>(items: { item: T; weight: number }[]): T {
    const total = items.reduce((sum, i) => sum + i.weight, 0);
    let r = this.next() * total;
    for (const { item, weight } of items) {
      if (r <= weight) return item;
      r -= weight;
    }
    return items[items.length - 1].item;
  }

  /** Box-Muller transform for normal distribution */
  nextGaussian(mean: number = 0, stdDev: number = 1): number {
    let u1 = this.next();
    let u2 = this.next();
    while (u1 === 0) u1 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  /** Clamped value between min and max */
  clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }
}
