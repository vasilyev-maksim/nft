import { File, FileError } from './File';

export interface ISnapshot {
  categories: {
    id: number;
    prefix: string;
    probability: number;
    order: number;
  }[];
  layers: {
    filename: string;
    id: number;
    category: number;
  }[];
  version: number;
  updatedAt: string;
}

export interface IUserConfig {
  categories: {
    prefix: string;
    probability: number;
  }[];
}

export class ConfigError extends FileError {
  public constructor(message: string, sourse: File, childError?: Error) {
    super(message, sourse, childError);
    this.name = 'ConfigError';
  }
}

export class Config {
  public constructor(private readonly configFile: File, private readonly snapshotFile: File) {}

  public getSnapshot(): ISnapshot | undefined {
    try {
      return this.snapshotFile.readJson<ISnapshot>();
    } catch (childError: any) {}
  }

  public updateSnapshot(snapshot: ISnapshot): void {
    try {
      return this.snapshotFile.write(JSON.stringify(snapshot, null, 2));
    } catch (childError: any) {
      throw new ConfigError(`Snapshot update failed`, this.snapshotFile, childError);
    }
  }

  public getUserConfig(): IUserConfig {
    try {
      return {
        categories: this.configFile.readLines().map(x => {
          const [prefix, probability] = x.split(' ');
          return { prefix, probability: Number(probability) };
        }),
      };
    } catch (childError: any) {
      throw new ConfigError(`Invalid config file`, this.configFile, childError);
    }
  }
}
