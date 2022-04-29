import { File, FileError } from './File';
import { FidSource } from './Fid';
import { ILayersConfig } from './Layer';
import { IidBuilder } from './IidBuilder';
import { Schema, Parser } from './Parser';

export interface IConfig {
  layers: ILayersConfig;
}

export class ConfigError extends FileError {
  public constructor(message: string, sourse: FidSource, childError?: Error) {
    super(message, sourse, childError);
    this.name = 'ConfigError';
  }
}

export class Config {
  public constructor(public readonly configFile: File<IConfig>) {}

  public getConfig(): IConfig {
    let config: IConfig;

    try {
      config = this.configFile!.readJson();
    } catch (childError: any) {
      throw new ConfigError(`Could not find valid json config in directory`, this.configFile, childError);
    }

    // TODO: match against schema
    if (typeof config.layers !== 'object' || Object.keys(config.layers).length === 0) {
      throw new ConfigError(`No layers found in config`, this.configFile);
    } else {
      return config;
    }
  }
}
