export interface ICodec<S extends Schema> {
  decode(str: string, schema: S): S;
  encode(schema: S): string;
}

export type Schema = string | number | { [k: string]: Schema } | Schema[];

// TODO: пропускать случай с одним листом ( не увеличивать вложенность)

export class ParsingError extends Error {
  public constructor(
    message: string,
    public meta: {
      source?: string;
      chunk?: string;
      schema?: Schema;
    } = {},
  ) {
    super(message);
    this.name = 'ParsingError';
  }
}

export class Parser<S extends Schema> implements ICodec<S> {
  public constructor() {}

  public decode(str: string, schema: S): S {
    const separatorChar = str[str.length - 1];
    const source = str.slice(0, -1);
    const depth = Parser.getSchemaDepth(schema);
    console.log(depth);

    function recursiveDecode(schema: S, chunk: string, currDepth = 0): any {
      const separator = separatorChar.repeat(depth - currDepth);

      if (typeof schema === 'object') {
        const chunks = chunk.split(separator);

        if (Array.isArray(schema)) {
          return chunks.map(chunk => recursiveDecode(schema[0] as any, chunk, currDepth + 1));
        } else {
          Object.keys(schema)
            .sort()
            .forEach((key, i) => {
              const value = recursiveDecode(schema[key as any] as any, chunks[i], currDepth + 1);
              schema[key] = value;
            });
          return schema;
        }
      } else if (typeof schema === 'string') {
        return chunk;
      } else if (typeof schema === 'number') {
        return Number(chunk);
      }
    }

    recursiveDecode(schema, source);

    return schema;
  }

  public encode(schema: S): string {
    const separatorChar = ':'; // TODO: dynamic encoding
    const depth = Parser.getSchemaDepth(schema);
    console.log(depth);

    function recursiveEncode(schema: S, currDepth = 0): string {
      const separator = separatorChar.repeat(depth - currDepth);

      if (typeof schema === 'object') {
        if (Array.isArray(schema)) {
          return schema.map(x => recursiveEncode(x as any, currDepth + 1)).join(separator);
        } else {
          return Object.keys(schema)
            .sort()
            .map(key => recursiveEncode(schema[key as any] as any, currDepth + 1))
            .join(separator);
        }
      } else if (typeof schema === 'string') {
        return schema;
      } else if (typeof schema === 'number') {
        return schema.toString();
      } else {
        throw new ParsingError(`Invalid schema type: ${typeof schema}`, { schema });
      }
    }

    return recursiveEncode(schema) + separatorChar;
  }

  private static getSchemaDepth<T>(schema: Schema, res: number = 0): number {
    if (Array.isArray(schema)) {
      return Math.max(...schema.map(s => this.getSchemaDepth(s, res + 1)));
    } else if (typeof schema === 'object') {
      return Math.max(...Object.values(schema).map(s => this.getSchemaDepth(s, res + 1)));
    } else {
      return res;
    }
  }
}

// const parser = new Parser();
// const schema: Schema = {
//   name: 'Maksim',
//   surname: 'Vasilyev',
//   address: {
//     street: 'Georgiu Malikidi',
//     house: '16',
//   },
//   friends: [
//     { name: 'Farid', age: 27 },
//     { name: 'Lala', age: 29 },
//   ],
// };

// const str = '16::Georgiu Malikidi:::27:Farid::29:Lala:::Maksim:::Vasilyev:';
// console.log(parser.encode(schema));
// console.log(parser.decode(str, schema));
