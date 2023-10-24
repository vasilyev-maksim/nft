import { Iid } from 'shared';
import { Layer } from './Layer';

export class Category {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly probability: number,
    private layers: Layer[],
  ) {}

  public getRandomLayer(): Layer | null {
    return Math.random() <= this.probability ? this.layers[Math.floor(Math.random() * this.layers.length)] : null;
  }

  public getLayerById(id: number): Layer | undefined {
    return this.layers.find(l => l.id === id);
  }

  public getOneOfLayers(iid: Iid): Layer | undefined {
    return this.layers.find(l => iid.contains(l));
  }

  public getAllLayers(): Layer[] {
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
