import { Layer, LayersProvider } from './Layer';
import { LayerGroup } from './LayerGroup';
import { Image } from './Image';
import { Id, Iid } from 'shared';
import { Directory } from './Directory';
import { Config } from './Config';

export type ISequence = {
  prefix: number;
  probability: number;
  order: number;
}[];

export class Collection {
  public static CONFIG_FILE = '/layers.json';
  public static RESULTS_DIR = '/results';

  private groups: LayerGroup[] = [];
  private sequence: ISequence = [];
  private readonly config: Config;
  private readonly resultsDir: Directory;

  public get name() {
    return this.dir.fid.name;
  }

  public constructor(private readonly dir: Directory) {
    const configFile = this.dir.getFileByName(Collection.CONFIG_FILE);

    this.resultsDir = this.dir.getDirectoryByName(Collection.RESULTS_DIR);
    this.config = new Config(configFile);
    this.config.configFile.watch(() => this.init());
    this.init();
  }

  private init(): void {
    const layerFiles = this.dir.readFilesOnly().filter(f => f.ext === 'svg');
    const config = this.config.getConfig();
    const layerProvider = new LayersProvider(config.layers);
    const allLayers = layerFiles.map(file => layerProvider.create(file));

    // TODO:
    this.sequence = this.decodeString(
      'back_1 legs_1 shoes_1 arms_1 tors_1 top_1 necklace_0.3 scarf_0.1 jacket_0.3 face_1 eyes_1 lips_1 tattoo_0.5 hair_1 headset_1 glasses_0.3',
    );

    this.groups = this.sequence
      .sort((a, b) => a.order - b.order)
      .map(x => {
        const layers = allLayers.filter(l => l.file.name.startsWith(x.prefix.toString()));
        return new LayerGroup(x.prefix, x.probability, layers);
      });
  }

  private decodeString(str: string): ISequence {
    return str.split(' ').map((x, i) => {
      const [prefix, probability] = x.split('_');
      return { prefix: Number(prefix), probability: Number(probability), order: i };
    });
  }

  public getRandomImageIid(): Iid {
    const layerIds = this.groups
      .map(x => x.getRandom())
      .filter(Boolean)
      .map(x => x?.id) as Id[];
    return new Iid({ layerIds, collection: this.name });
  }

  public getImageByIid(iid: Iid): Image | null {
    const layers = this.groups.map(x => x.getOneOf(iid)).filter(Boolean) as Layer[];
    return layers.length > 0 ? new Image(layers) : null;
  }

  public toJSON(): any {
    return {
      groups: this.groups,
      name: this.name,
    };
  }

  public saveImage(iid: Iid): void {
    const file = this.resultsDir.getFileByName(iid.toString() + '.svg');
    const image = this.getImageByIid(iid);
    return image?.saveToSvg(iid.size.width, iid.size.width, file);
  }
}
