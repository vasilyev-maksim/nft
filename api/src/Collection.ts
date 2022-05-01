import { Layer } from './Layer';
import { CategoryProvider } from './CategoryProvider';
import { Category } from './Category';
import { Image } from './Image';
import { Iid, IidBuilder } from 'shared';
import { Directory } from './Directory';
import { Config } from './Config';

export class Collection {
  private static readonly CONFIG_FILE = 'config.txt';
  private static readonly SNAPSHOT_FILE = '__snapshot.txt';
  private static readonly RESULTS_DIR = 'results';

  private categories: Category[] = [];
  private version: number = 0;
  private readonly categoryProvider: CategoryProvider;
  private readonly resultsDir: Directory;

  public get name() {
    return this.dir.fid.name;
  }

  public constructor(private readonly dir: Directory) {
    const configFile = this.dir.getFileByName(Collection.CONFIG_FILE);
    const snapshotFile = this.dir.getFileByName(Collection.SNAPSHOT_FILE);
    const config = new Config(configFile, snapshotFile);

    this.resultsDir = this.dir.getDirectoryByName(Collection.RESULTS_DIR);
    this.categoryProvider = new CategoryProvider(config);

    this.init();
    // TODO: implemetn proper files watch
    dir.watch(() => {
      console.log(this.name + ' collection root dir updated, reinitializing collection');
      // return this.init();
    });
  }

  private init(): void {
    const { categories, version } = this.categoryProvider.readCategoriesFromDir(this.dir);

    this.categories = categories;
    this.version = version;
  }

  public getRandomImageIid(): Iid {
    const layers = this.categories.map(x => x.getRandom()).filter(Boolean) as Layer[];
    return new IidBuilder(this.version, layers, this.name).build();
  }

  public getImageByIid(iid: Iid): Image | null {
    const layers = this.categories.map(x => x.getOneOf(iid)).filter(Boolean) as Layer[];
    return layers.length > 0 ? new Image(layers) : null;
  }

  public toJSON(): any {
    return {
      categories: this.categories,
      name: this.name,
    };
  }

  public saveImage(iid: Iid, filename: string): void {
    const file = this.resultsDir.getFileByName((filename || iid.id) + '.svg');
    const image = this.getImageByIid(iid);
    return image?.saveToSvg(iid.width, iid.width, file);
  }
}
