import { mkdir, mkdirSync, readFileSync, watchFile, writeFileSync } from 'fs';
import { parse } from 'path';
import { AppError } from 'shared';
import { Directory } from './Directory';
import { Fid, FidSource, FidSourceExcept } from './Fid';

export class FileError extends AppError {
  public constructor(public readonly message: string, public readonly sourse: FidSource, childError?: Error) {
    super(message, { childError });
    this.name = 'FileError';
  }
}

export class File<ParsedJson = unknown> {
  public readonly fid: Fid;
  public readonly ext: string;
  public readonly name: string;
  public get fullName(): string {
    return this.fid.name;
  }

  public constructor(sourse: FidSourceExcept<Directory>) {
    this.fid = Fid.from(sourse);

    const { ext, name } = parse(this.fid.path);
    this.ext = ext;
    this.name = name;
  }

  public watch(listener: () => void, interval = 1000): void {
    watchFile(this.fid.path, { interval }, listener);
  }

  public read(): string {
    try {
      return readFileSync(this.fid.path).toString();
    } catch (err: any) {
      throw new FileError('Could not read file', this.fid, err);
    }
  }

  public readJson<T = ParsedJson>(): T {
    const content = this.read();
    try {
      return JSON.parse(content);
    } catch (err: any) {
      throw new FileError('File is not JSON', this.fid, err);
    }
  }

  public readLines(): string[] {
    return this.read()
      .split(/\r?\n/gm)
      .map(x => x.trim())
      .filter(Boolean);
  }

  public write(content: string): void {
    mkdirSync(this.fid.root, { recursive: true });
    writeFileSync(this.fid.path, content);
  }
}
