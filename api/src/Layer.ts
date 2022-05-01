import { Layer as LayerData } from 'shared';
import { File } from './File';

export class Layer extends LayerData {
  public constructor(id: number, category: number, /* TODO: make private*/ public readonly file: File) {
    super(id, category);
  }

  public get svgBody(): string {
    const content = this.file.read();
    return [...content.replace(/\r?\n/gm, '').matchAll(/<svg(.*?)>(.*?)<\/svg/gm)][0][2];
  }
}
