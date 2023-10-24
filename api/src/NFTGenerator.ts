import { Lazy } from './Lazy';
import { Collection } from './Collection';
import { Directory } from './Directory';

// TODO: watch for changes
export class NFTGenerator {
  private collections = new Lazy<Collection[]>(() => this.getCollections());

  public constructor(private readonly dir: Directory) {
    this.dir.watch(() => {
      try {
        this.collections.invalidate();
      } catch {}
    });
  }

  public findCollection(name: string): Collection | undefined {
    return this.collections.value.find(x => x.name === name);
  }

  public getCollections(): Collection[] {
    return this.dir
      .readDirectoriesOnly()
      .filter(x => !x.name.startsWith('_'))
      .map(dir => new Collection(dir));
  }

  public getCollectionNames(): string[] {
    return this.collections.value.map(x => x.name);
  }
}
