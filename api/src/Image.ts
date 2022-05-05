import { Layer } from './Layer';
import { File } from './File';

export class Image {
  private static WIDTH_PLACEHOLDER = '__[W]__';
  private static HEIGHT_PLACEHOLDER = '__[H]__';

  public constructor(private readonly layers: Layer[]) {}

  public saveToSvg(width: number, height: number, file: File): void {
    file.write(this.toSvgString(width, height));
  }

  public saveToPng(): void {}

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
      this.layers.map(x => x.svgBody).join('\n') +
      '</svg>'
    );
  }
}
