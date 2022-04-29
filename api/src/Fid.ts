import { join, parse } from 'path';
import { Directory } from './Directory';
import { File } from './File';

export type FidSource = string | Fid | File | Directory;
export type FidSourceExcept<T> = Exclude<FidSource, T>;

export class Fid {
  // TODO: различать файлы от папок
  public readonly root: string;
  public readonly name: string;
  public readonly path: string;

  public constructor(pathOrFid: string | Fid);
  public constructor(root: string, name: string);
  public constructor(rootOrPathOrFid: string | Fid, name?: string) {
    if (rootOrPathOrFid instanceof Fid) {
      this.root = rootOrPathOrFid.root;
      this.name = rootOrPathOrFid.name;
      this.path = rootOrPathOrFid.path;
    } else if (name === undefined) {
      const { base, dir } = parse(rootOrPathOrFid);
      this.path = rootOrPathOrFid;
      this.name = base;
      this.root = dir;
    } else {
      this.name = name;
      this.root = rootOrPathOrFid;
      this.path = join(rootOrPathOrFid, name);
    }
  }

  public getChildFid(name: string): Fid {
    return new Fid(this.path, name);
  }

  public static from(source: FidSource): Fid {
    return source instanceof Directory ? source.fid : source instanceof File ? source.fid : new Fid(source);
  }
}
