import { Iid } from './Iid';
import { Layer } from './Layer';

export class LayerGroup {
  public constructor(public readonly id: Layer['id'], public readonly probability: number, private layers: Layer[]) {}

  public getRandom(): Layer | null {
    return Math.random() <= this.probability ? this.layers[Math.floor(Math.random() * this.layers.length)] : null;
  }

  public getById(id: Layer['id']): Layer | undefined {
    return this.layers.find(l => l.id === id);
  }

  public getOneOf(iid: Iid): Layer | undefined {
    return this.layers.find(l => iid.contains(l.id));
  }

  public getAll(): Layer[] {
    return this.layers.slice();
  }

  public toJSON(): any {
    return {
      layers: this.layers,
      id: this.id,
      probability: this.probability,
    };
  }
}
