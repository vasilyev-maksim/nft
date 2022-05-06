import { Directory } from './Directory';
import { File } from './File';

interface Layer {
  id: number;
  category: number;
  file: File;
}

export class LayerManager {
  public constructor(private readonly dir: Directory) {}

  // readLayers():
}

interface ILayerSnapshotJSON {
  body: string;
  filename: string;
  classnamesMap: { [key: string]: string };
  hash: string;
  generatedAt: Date;
  updatedAt: Date;
}

class LayerSnapshot {
  private json: ILayerSnapshotJSON = null as any; // null doesn't matter, value will be set in init function;
  private snapshotFile: File;

  public constructor(public readonly sourceFile: File) {
    // TODO: разделить наконец Fid и Did
    const snapshotFilename = sourceFile.fid.name.replace(/\.svg$/, '.snapshot.json');
    this.snapshotFile = new File(snapshotFilename);

    this.init();
    this.sourceFile.watchHashChange(hash => this.init(hash));
  }

  private init(hash?: string): void {
    if (this.json.hash !== hash) {
      try {
        this.json = this.snapshotFile.readJson<ILayerSnapshotJSON>();
      } catch {
        this.json = this.makeSnapshot();
      }
    }
  }

  private makeSnapshot(): ILayerSnapshotJSON {
    const str = this.sourceFile.read();
  }
}

// + структура json файла / interface
// класс снепшота
//   публичный интерфейса для Image
//   + внутренний для всего что ниже по списку
// записывать в файл
// + прочитать из файла
// + хэширование
// + сравнивание хэшей
// + наблюдение за файлом и рекалькуляция json
// изменить структуру Layer класса
// соответственно моенять Image
// определить какие отношения между collection snapshot и layer snapshot
// impl CollectionManager
// разделить наконец Fid и Did
