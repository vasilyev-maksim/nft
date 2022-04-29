import { Iid } from './Iid';
import { IidBuilder } from './IidBuilder';
import { ICodec, Parser, Schema } from './Parser';

export class Codec {
  private readonly parser: ICodec<IidBuilder, string>;

  public constructor(parser?: ICodec<IidBuilder, string>) {
    if (parser) {
      this.parser = parser;
    } else {
      const schema: Schema<IidBuilder> = [
        {
          type: 'valuesArray',
          encode: builder => builder.source!.layerIds!,
          decode: (layers, builder) => builder.withLayers(layers),
        },
        [
          {
            type: 'singleValue',
            encode: builder => builder.source!.size!.width!.toString(),
            decode: (width, builder) => builder.withWidth(Number(width)),
          },
          {
            type: 'singleValue',
            encode: builder => builder.source!.size!.height!.toString(),
            decode: (height, builder) => builder.withHeight(Number(height)),
          },
          {
            type: 'singleValue',
            encode: builder => builder.source!.collection!.toString(),
            decode: (collection, builder) => builder.withCollection(collection),
          },
        ],
      ];
      this.parser = new Parser(schema);
    }
  }

  public decode(source: string): Iid {
    return this.parser.decode(source, new IidBuilder()).build();
  }

  public encode(iid: Iid): string {
    return this.parser.encode(iid.getBuilder());
  }
}
