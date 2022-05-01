import { IidData } from './IidBuilder';
import { Parser } from './Parser';
import { RecursiveRequired } from './utils';

export interface ICodec<T> {
  decode(str: string): T;
  encode(target: T): string;
}

export class IidCodec extends Parser<IidData> implements ICodec<IidData> {
  public decode(source: string): IidData {
    const schema: RecursiveRequired<IidData> = {
      layers: [
        {
          id: 0,
          category: 0,
        },
      ],
      width: 0,
      height: 0,
      collection: '',
      version: 0,
    };
    return super.decode(source, schema);
  }

  public encode(data: IidData): string {
    return super.encode(data);
  }
}
