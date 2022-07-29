import { readdirSync, watchFile } from 'fs';
import { join, resolve, basename } from 'path';
import { File } from './File';

// TODO: custom error class

export class Directory {
  public readonly path: string;

  public constructor(source: string | Directory) {
    this.path = source instanceof Directory ? source.path : source;
  }

  public get name() {
    return basename(this.path);
  }

  public getParentDir(): Directory {
    return new Directory(resolve(this.path, '..'));
  }

  public read(): (File | Directory)[] {
    return readdirSync(this.path, { withFileTypes: true })
      .map(x => {
        if (!x.name.startsWith('.')) {
          if (x.isDirectory()) {
            return this.getDirectoryByName(x.name);
          } else if (x.isFile()) {
            return this.getFileByName(x.name);
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
    watchFile(this.path, { interval }, listener);
  }

  public getFileByName(name: string): File {
    return new File(this.path, name);
  }

  public getDirectoryByName(name: string): Directory {
    return new Directory(join(this.path, name));
  }
}
