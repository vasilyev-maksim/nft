import { Layer } from './Layer';
import { CategoryManager } from './CategoryManager';
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
  private readonly categoryProvider: CategoryManager;
  private readonly resultsDir: Directory;

  public get name() {
    return this.dir.name;
  }

  public constructor(private readonly dir: Directory) {
    const configFile = this.dir.getFileByName(Collection.CONFIG_FILE);
    const snapshotFile = this.dir.getFileByName(Collection.SNAPSHOT_FILE);
    const config = new Config(configFile, snapshotFile);

    this.resultsDir = this.dir.getDirectoryByName(Collection.RESULTS_DIR);
    this.categoryProvider = new CategoryManager(config);

    this.init();
    // TODO: implement proper files watch
    dir.watch(() => {
      console.log(this.name + ' collection root dir updated, reinitializing collection');
      return this.init();
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
    return layers.length > 0 ? new Image(layers, iid) : null;
  }

  public toJSON(): any {
    return {
      categories: this.categories,
      name: this.name,
    };
  }

  public saveImage(iid: Iid, filename: string, format: 'svg' | 'png'): void {
    const file = this.resultsDir.getFileByName((filename || iid.id) + '.' + format);
    const image = this.getImageByIid(iid);

    if (format === 'svg') {
      image?.saveToSvg(iid.width, iid.width, file);
    } else if (format === 'png') {
      image?.saveToPng(iid.width, iid.width, file);
    }
  }

  public getCategories() {
    return this.categories;
  }
}
