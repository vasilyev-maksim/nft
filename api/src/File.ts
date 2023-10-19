import { mkdirSync, readFileSync, watchFile, writeFileSync, unlinkSync } from 'fs';
import { join, parse } from 'path';
import { AppError } from 'shared';
import { Directory } from './Directory';
import crypto from 'crypto';

export class FileError extends AppError {
  public constructor(
    public readonly message: string,
    public readonly sourse: File,
    childError?: Error,
  ) {
    super(message, { childError });
    this.name = 'FileError';
  }
}

export class File<ParsedJson = unknown> {
  public readonly parentDir: Directory;
  public readonly ext: string;
  public readonly name: string;

  public constructor(path: string | File<ParsedJson>);
  public constructor(root: string | Directory, filename: string);
  public constructor(rootOrPath: string | Directory | File<ParsedJson>, filename?: string) {
    if (filename === undefined) {
      if (!(rootOrPath instanceof Directory)) {
        if (rootOrPath instanceof File) {
          this.parentDir = rootOrPath.parentDir;
          this.name = rootOrPath.name;
          this.ext = rootOrPath.ext;
        } else {
          const { dir, name, ext } = parse(rootOrPath);
          this.name = name;
          this.ext = ext;
          this.parentDir = new Directory(dir);
        }
      } else {
        throw new FileError(`Invalid arguments: first arg shouldn't be a directory`, this);
      }
    } else {
      if (!(rootOrPath instanceof File)) {
        this.parentDir = rootOrPath instanceof Directory ? rootOrPath : new Directory(rootOrPath);
        const { name, ext } = parse(filename);
        this.ext = ext;
        this.name = name;
      } else {
        throw new FileError(`Invalid arguments: first arg shouldn't be a file`, this);
      }
    }

    this.ext = this.ext.slice(1);
  }

  public getSiblingFile(fullname: string): File<ParsedJson> {
    return this.parentDir.getFileByName(fullname);
  }

  public withName(name: string): File<ParsedJson> {
    return new File(this.parentDir, name + '.' + this.ext);
  }

  public withExt(ext: string): File<ParsedJson> {
    return new File(this.parentDir, this.name + '.' + ext);
  }

  public get fullName(): string {
    return this.name + '.' + this.ext;
  }

  public get path(): string {
    // console.log(232323,this.parentDir.path, this.fullName);
    return join(this.parentDir.path, this.fullName);
  }

  public watch(listener: () => void, interval = 1000): void {
    watchFile(this.path, { interval }, listener);
  }

  public watchHashChange(callback: (hash?: string) => void, interval = 1000) {
    this.watch(() => {
      callback(this.getContentHash());
    }, interval);
  }

  public getContentHash(): string | undefined {
    try {
      const content = this.read();
      const hash = crypto.createHash('md5');
      hash.update(content);
      return hash.digest('hex');
    } catch {}
  }

  public readBuffer(): Buffer {
    try {
      return readFileSync(this.path);
    } catch (err: any) {
      throw new FileError('Could not read file', this, err);
    }
  }

  public read(): string {
    return this.readBuffer().toString();
  }

  public readJson<T = ParsedJson>(): T {
    const content = this.read();
    try {
      return JSON.parse(content);
    } catch (err: any) {
      throw new FileError('File is not JSON', this, err);
    }
  }

  public readLines(): string[] {
    return this.read()
      .split(/\r?\n/gm)
      .map(x => x.trim())
      .filter(Boolean);
  }

  public write(content: string): void {
    mkdirSync(this.parentDir.path, { recursive: true });
    writeFileSync(this.path, content);
  }

  public writeJson(content: unknown): void {
    this.write(JSON.stringify(content));
  }

  public delete(): void {
    unlinkSync(this.path);
  }
}
