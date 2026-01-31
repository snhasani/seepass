export class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed + 0x6d2b79f5) | 0;
    let t = Math.imul(this.seed ^ (this.seed >>> 15), this.seed | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  float(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1));
  }

  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  weightedPick<T>(items: Array<{ item: T; weight: number }>): T {
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    let r = this.next() * total;
    for (const { item, weight } of items) {
      r -= weight;
      if (r <= 0) return item;
    }
    return items[items.length - 1].item;
  }
}
