import { Layer } from './Layer';
import { File } from './File';
import sharp from 'sharp';
import { Iid } from 'shared';

export class Image {
  private static WIDTH_PLACEHOLDER = '__[W]__';
  private static HEIGHT_PLACEHOLDER = '__[H]__';

  public constructor(private readonly layers: Layer[], private readonly iid: Iid) {}

  public saveToSvg(width: number, height: number, file: File): void {
    file.write(this.toSvgString(width, height));
  }

  public async saveToPng(width: number, height: number, file: File): Promise<void> {
    try {
      const tempName = Math.round(Math.random() * 100) + '.svg';
      const tempFile = file.getSiblingFile(tempName);
      this.saveToSvg(width, height, tempFile);
      await sharp(tempFile.path).resize(width, height).png().toFile(file.path);
      tempFile.delete();
    } catch (err) {
      console.error(err);
    }
  }

  public toSvgTemplate() {
    return {
      text: this.toSvgString(Image.WIDTH_PLACEHOLDER, Image.HEIGHT_PLACEHOLDER),
      placeholders: {
        width: Image.WIDTH_PLACEHOLDER,
        height: Image.HEIGHT_PLACEHOLDER,
      },
    };
  }

  public toSvgString(width: number | string, height: number | string) {
    return (
      `<svg width="${width}" height="${height}" viewBox="0 0 1660 1660" xmlns="http://www.w3.org/2000/svg">` +
      this.layers.map(x => x.getSvgBody()).join('\n') +
      '</svg>'
    );
  }

  public toPngBuffer(): Promise<Buffer> {
    return sharp({
      create: {
        width: 1000, //this.iid.width,
        height: 1000, //this.iid.height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .composite(this.layers.map(x => ({ input: x.file.path })))
      .toBuffer();
  }
}
