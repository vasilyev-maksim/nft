import { AppError } from './AppError';
import { Codec } from './Codec';
import { IidBuilder } from './IidBuilder';
import { RecursiveReadonly, RecursiveRequired } from './utils';

// TODO: custom error class
//TODO: add version to IID to reload app if collection fs changed
// TODO: encode layer category to IId

export type Id = number;

export interface IidData {
  layerIds: Id[];
  collection: string;
  size?: {
    width: number;
    height: number;
  };
}

export type IidSourse = string | Iid | IidData | IidBuilder;

export class Iid {
  private readonly codec = new Codec();
  private readonly data: RecursiveReadonly<RecursiveRequired<IidData>> = {
    layerIds: [],
    collection: '',
    size: {
      width: 300,
      height: 300,
    },
  };

  public readonly id: string = 'invalid';
  public get layerIds() {
    return this.data.layerIds;
  }
  public get collection() {
    return this.data.collection;
  }
  public get size() {
    return {
      width: this.data.size.width,
      height: this.data.size.height,
    };
  }

  public constructor(source: IidSourse) {
    try {
      if (source) {
        const data =
          source instanceof Iid
            ? source.data
            : source instanceof IidBuilder
            ? source.source
            : typeof source === 'string'
            ? this.codec.decode(source).data
            : source;

        const copy: IidData = JSON.parse(JSON.stringify(data));
        copy.collection =
          copy.collection ||
          this.data.collection ||
          (() => {
            throw new AppError('Invalid collection');
          })();
        copy.layerIds = [
          ...new Set(
            copy.layerIds.length
              ? copy.layerIds
              : this.data.layerIds.length
              ? this.data.layerIds
              : (() => {
                  throw new AppError('Invalid layers');
                })(),
          ),
        ];
        copy.size = {
          width: copy.size?.width || this.data.size.width,
          height: copy.size?.height || this.data.size.height,
        };

        this.data = copy as Iid['data'];
        this.id = this.codec.encode(this);
      } else {
        throw new AppError('Iid source is undefined');
      }
    } catch (childError: any) {
      throw new AppError('Iid.ctor failed', {
        iid: source instanceof Iid || typeof source === 'string' ? source : undefined,
        childError,
      });
    }
  }

  public contains(layerId: Id): boolean {
    return this.data.layerIds.includes(layerId);
  }

  public toJSON(): string {
    return this.id;
  }

  public getBuilder(): IidBuilder {
    return new IidBuilder(this.data);
  }
}
