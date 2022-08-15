import { Layer } from './Layer';
import { File } from './File';
import sharp, { Sharp } from 'sharp';
import { Iid } from 'shared';

export class Image {
  public constructor(private readonly layers: Layer[], private readonly iid: Iid) {}

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
        width: 1000, // TODO: this.iid.width,
        height: 1000, //this.iid.height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .composite(this.layers.map(x => ({ input: x.file.path })));
  }
}
