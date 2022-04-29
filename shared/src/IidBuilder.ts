import { IidData, Iid, Id } from './Iid';
import { RecursivePartial } from './utils';

export class IidBuilder {
  public readonly source: RecursivePartial<IidData>;

  public constructor(source: RecursivePartial<IidData> = {}) {
    this.source = source instanceof Iid ? source.getBuilder().source : source;
  }

  public map(mapper: (source: RecursivePartial<IidData>) => void): this {
    mapper(this.source);
    return this;
  }

  public withHeight(height: number): this {
    return this.map(x => (x.size = { ...x.size, height }));
  }

  public withWidth(width: number): this {
    return this.map(x => (x.size = { ...x.size, width }));
  }

  public withCollection(collection: string): this {
    return this.map(x => (x.collection = collection));
  }

  public withSingleLayer(layerId: Id): this {
    return this.map(x => (x.layerIds = [layerId]));
  }

  public withLayers(layers: Id[]): this {
    return this.map(x => (x.layerIds = layers));
  }

  public addLayer(layerId: Id): this {
    return this.map(x => (x.layerIds = [...(x.layerIds ?? []), layerId]));
  }

  public removeLayer(layerId: Id): this {
    return this.map(x => (x.layerIds = (x.layerIds ?? []).filter(l => l !== layerId)));
  }

  public build(): Iid {
    return new Iid(this.source as IidData);
  }
}
