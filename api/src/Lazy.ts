export class Lazy<T> {
  private cache: T | null = null;

  public constructor(private readonly getter: () => T) {}

  public get value(): T {
    if (this.cache === null) {
      this.cache = this.getter();
    }

    return this.cache;
  }

  public invalidate(): void {
    this.cache = null;
  }
}
