import { Iid } from './Iid';
import { ILayer, Layer } from './Layer';
import { AppError } from './AppError';
import { object, define, string, nonempty, integer, min, array, Describe, size } from 'superstruct';
import { IidCodec } from './IidCodec';
import { ICodec } from './IidCodec';

const id = define<number>('ID', x => min(integer(), 0).is(x));
const _size = define<number>('Size', x => size(integer(), 100, 3000).is(x));

export interface IidData {
  layers: ILayer[];
  width: number;
  height: number;
  collection: string;
  version: number;
}

export class IidBuilder {
  private static iidDataSchema: Describe<IidData> = object({
    layers: nonempty(
      array(
        object({
          id: id,
          category: id,
        }),
      ),
    ),
    collection: nonempty(string()),
    width: _size,
    height: _size,
    version: id,
  });

  private layers?: Layer[];

  public constructor(
    private version?: number,
    layers?: (Layer | ILayer)[],
    private collection?: string,
    private width: number = 300,
    private height: number = 300,
    private codec: ICodec<IidData> = new IidCodec(),
  ) {
    this.layers = layers?.map(x => (x instanceof Layer ? x : new Layer(x.id, x.category)));
  }

  private clone(): IidBuilder {
    return new IidBuilder(this.version, this.layers, this.collection, this.width, this.height);
  }

  public fromIid(iid: Iid): IidBuilder {
    return this.fromIdString(iid.id);
  }

  public fromIdString(source: string): IidBuilder {
    const data = this.codec.decode(source);
    return new IidBuilder(data.version, data.layers, data.collection, data.width, data.height);
  }

  public toJSON(): Partial<IidData> {
    return {
      layers: this.layers?.map(x => x.toJSON()),
      collection: this.collection,
      width: this.width,
      height: this.height,
      version: this.version,
    };
  }

  public fromBuilder(builder: IidBuilder): IidBuilder {
    return builder.clone();
  }

  public withSize(height: number, width: number): IidBuilder {
    const clone = this.clone();
    clone.height = height;
    clone.width = width;
    return clone;
  }

  public withSingleLayer(layer: Layer): IidBuilder {
    return this.withLayers([layer]);
  }

  public withLayers(layers: Layer[]): IidBuilder {
    const clone = this.clone();
    clone.layers = layers.map(x => x.clone());
    return clone;
  }

  public withVersion(version: number): IidBuilder {
    const clone = this.clone();
    clone.version = version;
    return clone;
  }

  public addLayer(layer: Layer): IidBuilder {
    const clone = this.clone();
    const sameCatLayer = clone.layers?.find(x => x.category === layer.category);
    if (sameCatLayer) {
    clone.layers = [...(clone.layers ?? []), layer.clone()];
    return clone;
  }

  public removeLayer(layer: Layer): IidBuilder {
    const clone = this.clone();
    clone.layers = clone.layers?.filter(l => !l.equals?.(layer)) ?? [];
    return clone;
  }

  // public 

  public build(): Iid {
    try {
      const data = IidBuilder.iidDataSchema.create(this.toJSON());

      const id = this.codec.encode(data);
      const sanitized = this.fromIdString(id);
      const iid = new Iid(
        id,
        sanitized.collection!,
        sanitized.layers!,
        sanitized.version!,
        sanitized.width,
        sanitized.height,
      );
      return iid;
    } catch (childError: any) {
      throw new AppError('Iid build failed', {
        source: this,
        childError,
      });
    }
  }
}
