import { Lazy } from 'shared';
import { Collection } from './Collection';
import { Directory } from './Directory';

// TODO: watch for changes
export class CollectionProvider {
  private collections = new Lazy<Collection[]>(() => this.getCollections());

  public constructor(private readonly dir: Directory) {
    this.dir.watch(() => this.collections.invalidate());
  }

  public findCollection(name: string): Collection | undefined {
    return this.collections.value.find(x => x.name === name);
  }

  private getCollections(): Collection[] {
    return this.dir.readDirectoriesOnly().map(dir => new Collection(dir));
  }

  public getCollectionNames(): string[] {
    return this.collections.value.map(x => x.name);
  }
}
