import { Layer } from './Layer';
import { File } from './File';
import sharp, { Sharp } from 'sharp';
import { Iid } from 'shared';

export class Image {
  public constructor(
    private readonly layers: Layer[],
    public readonly iid: Iid,
  ) {}

  public async saveToPng(file: File): Promise<void> {
    try {
      this.toSharp().toFile(file.path);
    } catch (err) {
      console.error(err);
    }
  }

  public toPngBuffer(): Promise<Buffer> {
    return this.toSharp().toBuffer();
  }

  private toSharp(): Sharp {
    return sharp({
      create: {
        width: 1000, // if "this.iid.width" instead, sharp throws an error: Image to composite must have same dimensions or smaller
        height: 1000,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .composite(this.layers.map(x => ({ input: x.file.path })));
  }
}
