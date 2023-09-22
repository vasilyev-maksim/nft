// TODO: пропускать случай с одним листом ( не увеличивать вложенность)

export class ParsingError extends Error {
  public constructor(
    message: string,
    public meta: {
      source?: string;
      chunk?: string;
      schema?: any;
    } = {},
  ) {
    super(message);
    this.name = 'ParsingError';
  }
}

export class Parser<S = any> {
  public decode(str: string, schema: S): S {
    const separatorChar = str[str.length - 1];
    const source = str.slice(0, -1);
    const depth = Parser.getSchemaDepth(schema);

    function recursiveDecode(_schema: S, chunk: string, currDepth = 0): any {
      const separator = separatorChar.repeat(depth - currDepth);

      if (typeof _schema === 'object') {
        const chunks = chunk.split(separator);

        if (Array.isArray(_schema)) {
          return chunks.map(chunk => recursiveDecode(_schema[0], chunk, currDepth + 1));
        } else {
          return Object.keys(_schema as any)
            .sort()
            .reduce((acc, key, i) => {
              const s = _schema as Record<string, any>;
              const value = recursiveDecode(s[key], chunks[i], currDepth + 1);
              return { ...acc, [key]: value };
            }, {});
        }
      } else if (typeof _schema === 'string') {
        return chunk;
      } else if (typeof _schema === 'number') {
        return Number(chunk);
      }
    }

    return recursiveDecode(schema, source);
  }

  public encode(schema: S): string {
    const separatorChar = '_'; // TODO: dynamic encoding
    const depth = Parser.getSchemaDepth(schema);

    function recursiveEncode(schema: S, currDepth = 0): string {
      const separator = separatorChar.repeat(depth - currDepth);

      if (typeof schema === 'object') {
        if (Array.isArray(schema)) {
          return schema.map(x => recursiveEncode(x, currDepth + 1)).join(separator);
        } else {
          return Object.keys(schema as any)
            .sort()
            .map(key => recursiveEncode((schema as Record<string, any>)[key], currDepth + 1))
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

  private static getSchemaDepth<T>(schema: any, res: number = 0): number {
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
// const schema = {
//   layers: [
//     {
//       id: 0,
//       category: 0,
//     },
//   ],
//   collection: '',
//   width: 0,
//   height: 0,
//   version: 0,
// };

// const str = 'custom1:::300:::0:1::2:14::3:0::4:17::5:16::8:8::9:3::10:2::11:11::13:5::14:6:::44:::300:';
// const d = parser.decode(str, schema);
// const e = parser.encode(d);
// console.log(d);
// console.log(e);

// const parser = new Parser();
// const schema = {
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
