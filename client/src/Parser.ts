export interface ICodec<T, S = string, D = T> {
  decode(source: S, intial: D): D;
  encode(target: T): S;
}

type SingleValueCodec<T, D = T> = ICodec<T, string, D> & { type: 'singleValue' };
type ValuesArrayCodec<T, D = T> = ICodec<T, string[], D> & { type: 'valuesArray' };

export type Schema<T, D = T> = SingleValueCodec<T, D> | ValuesArrayCodec<T, D> | Schema<T, D>[];

export class ParsingError extends Error {
  public constructor(
    message: string,
    public meta: {
      source?: string;
      chunk?: string;
      schema?: Schema<any>;
    } = {},
  ) {
    super(message);
    this.name = 'ParsingError';
  }
}

export class Parser<T, D = T> implements ICodec<T, string, D> {
  public constructor(private readonly schema: Schema<T, D>) {}

  public decode(str: string, intialValue: D): D {
    const { schema } = this;
    const separatorChar = str[str.length - 1];
    const source = str.slice(0, -1);
    const depth = Parser.getSchemaDepth(this.schema);
    let acc = intialValue;

    function recursiveDecode(schema: Schema<T, D>, chunk: string, currDepth = 0): void {
      const separator = separatorChar.repeat(depth - currDepth);

      if (Array.isArray(schema)) {
        const chunks = chunk.split(separator);

        if (schema.length === chunks.length) {
          chunks.forEach((c, i) => recursiveDecode(schema[i], c, currDepth + 1));
        } else {
          throw new ParsingError(
            `Invalid number of chunks. Got ${chunks.length}, expected in schema ${schema.length})`,
            { chunk, source, schema },
          );
        }
      } else if (schema.type === 'singleValue') {
        acc = schema.decode(chunk, acc);
      } else if (schema.type === 'valuesArray') {
        if (chunk.includes(separatorChar)) {
          acc = schema.decode(chunk.split(separator), acc);
        } else {
          throw new ParsingError(`Chunk expected to be an array ('${separator}' separator not found inside)`, {
            chunk,
            source,
            schema,
          });
        }
      }
    }

    recursiveDecode(schema, source);
    return acc;
  }

  public encode(value: T): string {
    const separatorChar = ':'; // TODO: dynamic encoding
    const { schema } = this;
    const depth = Parser.getSchemaDepth(this.schema);

    function recursiveEncode(schema: Schema<T, D>, currDepth = 0): string {
      const separator = separatorChar.repeat(depth - currDepth);

      if (Array.isArray(schema)) {
        return schema.map(s => recursiveEncode(s, currDepth + 1)).join(separator);
      } else if (schema.type === 'singleValue') {
        return schema.encode(value);
      } else if (schema.type === 'valuesArray') {
        return schema.encode(value).join(separatorChar);
      } else {
        throw new ParsingError('Unknown schema type');
      }
    }

    return recursiveEncode(schema) + separatorChar;
  }

  private static getSchemaDepth<T, D>(schema: Schema<T, D>, res: number = 0): number {
    if (Array.isArray(schema)) {
      return Math.max(...schema.map(s => this.getSchemaDepth(s, res + 1)));
    } else if (schema.type === 'valuesArray') {
      return res + 1;
    } else {
      return res;
    }
  }
}

// const parser = new Parser(schema);
// const builder = new IidBuilder()
//   .withLayers(['layer_1', 'layer_2'])
//   .withWidth(100)
//   .withHeight(200)
//   .withCollection('test_collection');
// const decoded = parser.decode(
//   'back12:legs:shoes7:arms1:tors:top6:scarf1:face5:eyes4:lips3:hair4:headset_x5F_hat2::100:200:col1:',
//   new IidBuilder(),
// );
// const encoded = parser.encode(builder, ':');
// console.log({ decoded, encoded });
