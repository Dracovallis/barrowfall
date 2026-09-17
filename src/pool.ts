export class Pool<T extends { active: boolean }> {
  items: T[] = [];
  constructor(private make: () => T, warm = 0) {
    for (let i = 0; i < warm; i++) this.items.push(this.make());
  }
  get(): T {
    for (const it of this.items) if (!it.active) return it;
    const it = this.make();
    this.items.push(it);
    return it;
  }
  forEach(fn: (it: T) => void) {
    for (const it of this.items) if (it.active) fn(it);
  }
  count(): number {
    let n = 0;
    for (const it of this.items) if (it.active) n++;
    return n;
  }
}
