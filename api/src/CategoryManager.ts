import { Config, ISnapshot } from './Config';
import { Directory } from './Directory';
import { Category } from './Category';
import { Layer } from './Layer';

export class CategoryManager {
  public constructor(private readonly config: Config) {}

  public readCategoriesFromDir(dir: Directory): { categories: Category[]; version: number } {
    const layerFiles = dir.readFilesOnly().filter(f => f.ext === '.svg');
    const snapshot = this.config.getSnapshot();
    const userConfig = this.config.getUserConfig();

    let sid = snapshot ? Math.max(...snapshot.layers.map(l => l.id)) + 1 : 0;
    const categories: ISnapshot['categories'] = userConfig.categories.map((x, order) => {
      const old = snapshot?.categories.find(c => c.prefix === x.prefix);
      return { id: old?.id ?? sid++, prefix: x.prefix, probability: x.probability, order };
    });

    let lid = snapshot ? Math.max(...snapshot.layers.map(l => l.id)) + 1 : 0;
    const layers = layerFiles
      .map(file => {
        const old = snapshot?.layers.find(x => x.filename === file.name);
        const category = categories.find(x => file.name.startsWith(x.prefix));
        return category ? new Layer(old?.id ?? lid++, category.id, file) : null;
      })
      .filter(Boolean) as Layer[];

    const version = (snapshot?.version ?? 0) + 1;

    this.config.updateSnapshot({
      categories,
      layers: layers.map(l => ({ filename: l.file.name, id: l.id, category: l.category })),
      version,
      updatedAt: new Date().toISOString(),
    });

    return {
      categories: categories.map(
        category =>
          new Category(
            category.id,
            category.prefix,
            category.probability,
            layers.filter(l => l.category === category.id),
          ),
      ),
      version,
    };
  }
}