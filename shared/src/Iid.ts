import { Layer } from './Layer';

// TODO: custom error class
//TODO: add version to IID to reload app if collection fs changed
// TODO: encode layer category to IId

export class Iid {
  public get layers(): Layer[] {
    return this._layers.slice();
  }

  public constructor(
    public readonly id: string,
    public readonly collection: string,
    private readonly _layers: Layer[],
    public readonly version: number,
    public readonly width: number,
    public readonly height: number,
  ) {}

  public contains(layer: Layer): boolean {
    return this.layers.some(x => x.equals(layer));
  }

  public toJSON(): string {
    return this.id;
  }
}
