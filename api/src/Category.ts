import { Iid, Layer } from 'shared';

export class Category {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly probability: number,
    private layers: Layer[],
  ) {}

  public getRandom(): Layer | null {
    return Math.random() <= this.probability ? this.layers[Math.floor(Math.random() * this.layers.length)] : null;
  }

  public getById(id: number): Layer | undefined {
    return this.layers.find(l => l.id === id);
  }

  public getOneOf(iid: Iid): Layer | undefined {
    return this.layers.find(l => iid.contains(l));
  }

  public getAll(): Layer[] {
    return this.layers.slice();
  }

  public toJSON(): any {
    return {
      layers: this.layers,
      id: this.id,
      probability: this.probability,
      name: this.name,
    };
  }
}
