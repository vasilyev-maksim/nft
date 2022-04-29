import { Directory, DirectorySource } from './Directory';

export class FileSystem {
  public getDirectory(source: DirectorySource): Directory {
    return new Directory(source);
  }
}
