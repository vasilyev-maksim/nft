export interface ILayer {
  id: number;
  category: number;
}

export class Layer implements ILayer {
  public constructor(public readonly id: number, public readonly category: number) {}

  public equals(other: Layer): boolean {
    return this.id === other.id && this.category === other.category;
  }

  public inSameCategory(other: Layer): boolean {
    return this.category === other.category;
  }

  public clone(): Layer {
    return new Layer(this.id, this.category);
  }

  public toJSON(): ILayer {
    return {
      id: this.id,
      category: this.category,
    };
  }
}
