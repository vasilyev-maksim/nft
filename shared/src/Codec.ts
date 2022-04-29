import { Iid, IidData } from './Iid';
import { IidBuilder } from './IidBuilder';
import { ICodec, Parser, Schema } from './Parser';
import { RecursiveRequired } from './utils';

export class Codec {
  public constructor(private readonly parser: ICodec<RecursiveRequired<IidData>> = new Parser()) {}

  public decode(source: string): Iid {
    const schema: RecursiveRequired<IidData> = {
      collection: '',
      layerIds: [0],
      size: {
        width: 0,
        height: 0,
      },
    };
    const data = this.parser.decode(source, schema);
    return new Iid(data);
  }

  public encode(iid: Iid): string {
    return this.parser.encode(iid.getBuilder().source as RecursiveRequired<IidData>);
  }
}
