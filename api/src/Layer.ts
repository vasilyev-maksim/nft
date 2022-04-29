import { AppError, Id } from 'shared';
import { File } from './File';

export class Layer {
  public constructor(/* TODO: make private*/ public readonly file: File, public readonly id: number) {}

  public get svgBody(): string {
    const content = this.file.read();
    return [...content.replace(/\r?\n/gm, '').matchAll(/<svg(.*?)>(.*?)<\/svg/gm)][0][2];
  }

  public toJSON(): any {
    return this.id;
  }
}

export type ILayersConfig = Map<string, Id>;

export class LayersProvider {
  public Layer = Layer;
  public constructor(private readonly layersConfig: ILayersConfig) {}

  public create(file: File): Layer {
    const id = this.layersConfig.get(file.fullName);
    if (id) {
      return new Layer(file, id);
    } else {
      throw new AppError(`Layer id for '${file.fullName}' file not found in config`);
    }
  }
}
