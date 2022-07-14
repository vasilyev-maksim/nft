import { File } from './File';
import { Layer as LayerData } from 'shared';
import { Fid } from './Fid';
import { Image } from './Image';

interface ILayerSnapshotJSON {
  body: string;
  filename: string;
  suffix: string;
  hash: string;
  generatedAt: Date;
}

export class Layer extends LayerData {
  private snapshotFile: File;

  public constructor(public readonly file: File, id: number, category: number) {
    super(id, category);
    // TODO: разделить наконец Fid и Did
    const snapshotFilename = file.fid.name.replace(/\.svg$/, '.snapshot.json');
    const pngFilename = file.fid.name.replace(/\.svg$/, '.png'); //TODO: вынести в метод "file.fid.name.replace(/\.svg$/"
    this.snapshotFile = new File(file.fid.getSiblingFid(snapshotFilename));
    const snapshotJson = this.getSnapshotJson();
    this.snapshotFile.writeJson(snapshotJson);
    // new Image([this]).saveToPng(1000, 1000, new File(file.fid.getSiblingFid(pngFilename)));

    this.file.watchHashChange(hash => {
      if (hash) {
        this.snapshotFile.writeJson(this.getSnapshotJson(hash));
      }
    });
  }

  public getSvgBody(): string {
    return this.snapshotFile.readJson<ILayerSnapshotJSON>().body;
  }

  private getSnapshotJson(hash?: string): ILayerSnapshotJSON {
    const fileContent = this.file.read().replace(/\r?\n/gm, '');
    const [, svgTag, rawBody] = fileContent.match(/<svg(.*?)>(.*?)<\/svg/m) || [];
    const fillNone = svgTag.includes('fill="none"');
    const suffix = Math.round(Math.random() * 100) + '';
    const body = rawBody
      .replace(/(\.[a-zA-Z][\w\-]*?)(\s*[{,])/gm, (_, x, y) => {
        return x + '--' + suffix + y;
      })
      .replace(
        /(class=")(.*?)"/gm,
        (_, a: string, b: string) =>
          a +
          b
            .split(/\s/)
            .filter(Boolean)
            .map(x => x + '--' + suffix)
            .join(' ') +
          '"',
      );

    const json: ILayerSnapshotJSON = {
      body: fillNone ? '<svg fill="none">' + body + '</svg>' : body,
      filename: this.file.name,
      suffix,
      hash: hash ?? this.file.getContentHash()!,
      generatedAt: new Date(),
    };
    return json;
  }
}
