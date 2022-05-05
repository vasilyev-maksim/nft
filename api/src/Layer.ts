import { Layer as LayerData } from 'shared';
import { File } from './File';

export class Layer extends LayerData {
  public constructor(id: number, category: number, /* TODO: make private*/ public readonly file: File) {
    super(id, category);
  }

  public get svgBody(): string {
    const content = this.file.read();
    const temp = content.replace(/\r?\n/gm, '').match(/<svg(.*?)>(.*?)<\/svg/m)?.[2] ?? '';
    const map =
      [...temp.matchAll(/(\..*?)\s*?\{.*?}/g)].map(x => x[1].split(',').map(z => z.trim())).flatMap(x => x) ?? '';
    const t = map.reduce((str, cls) => {
      return str.split(cls.slice(1)).join(cls.slice(1) + Math.round(Math.random() * 1000));
    }, temp);
    return t;
  }
}
