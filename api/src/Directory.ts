import { readdirSync, watchFile } from 'fs';
import { Fid, FidSourceExcept } from './Fid';
import { File } from './File';

// TODO: custom error class

export type DirectorySource = FidSourceExcept<File>;

export class Directory {
  public readonly fid: Fid;

  public constructor(source: DirectorySource) {
    this.fid = Fid.from(source);
  }

  public read(): (File | Directory)[] {
    return readdirSync(this.fid.path, { withFileTypes: true })
      .map(x => {
        if (!x.name.startsWith('.')) {
          const childFid = this.fid.getChildFid(x.name);
          if (x.isDirectory()) {
            return new Directory(childFid);
          } else if (x.isFile()) {
            return new File(childFid);
          }
        }

        return null;
      })
      .filter(Boolean) as (File | Directory)[];
  }

  public readFilesOnly(): File[] {
    return this.read().filter(x => x instanceof File) as File[];
  }

  public readDirectoriesOnly(): Directory[] {
    return this.read().filter(x => x instanceof Directory) as Directory[];
  }

  public watch(listener: () => void, interval = 1000): void {
    // TODO: work only for files
    watchFile(this.fid.path, { interval }, listener);
  }

  public getFileByName(name: string): File {
    return new File(this.fid.getChildFid(name));
  }

  public getDirectoryByName(name: string): Directory {
    return new Directory(this.fid.getChildFid(name));
  }
}
