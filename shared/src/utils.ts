export type RecursiveReadonly<T> = {
  +readonly [P in keyof T]: T[P] extends (infer U)[]
    ? RecursiveReadonly<U>[]
    : T[P] extends object | undefined
    ? RecursiveReadonly<T[P]>
    : T[P];
};

export type RecursiveRequired<T> = {
  [P in keyof T]-?: T[P] extends (infer U)[]
    ? RecursiveRequired<U>[]
    : T[P] extends object | undefined
    ? RecursiveRequired<T[P]>
    : T[P];
};

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
    ? RecursivePartial<T[P]>
    : T[P];
};

// https://github.com/microsoft/TypeScript/issues/29594#issuecomment-507701193
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export class Lazy<T> {
  private cache: T | null = null;

  public constructor(private readonly getter: () => T) {}

  public get value(): T {
    if (this.cache === null) {
      this.cache = this.getter();
    }

    return this.cache;
  }

  public invalidate(): void {
    this.cache = null;
  }
}

// #!/usr/bin/env node

// import { readdirSync, readFileSync, writeFileSync } from 'fs';
// import path from 'path';
// import sharp from 'sharp';
// import { ILayer, ILayerGroup, IImage, ISequence } from './models';

// const order =
//   'back_1 legs_1 shoes_1 arms_1 tors_1 top_1 necklace_0.3 scarf_0.1 jacket_0.3 face_1 eyes_1 lips_1 tattoo_0.5 hair_1 headset_1 glasses_0.3'
//     .split(' ')
//     .map(x => {
//       const [id, probability] = x.split('_');
//       return { id, probability: Number(probability) };
//     });
// const layersDir = path.join(__dirname, '..', 'layers');
// const resultsDir = path.join(__dirname, '..', 'result');
// const layers = readdirSync(layersDir)
//   .map(x => {
//     try {
//       const fileContent = readFileSync(path.join(layersDir, x!)).toString();
//       return {
//         body: [...fileContent.replace(/\r?\n/gm, '').matchAll(/<svg(.*?)>(.*?)<\/svg/gm)][0][2],
//         id: x.replace('.svg', ''),
//         content: fileContent.replace(/width="(.*?)"/, `width="__[W]__"`).replace(/height="(.*?)"/, `height="__[H]__"`),
//         file: x,
//       };
//     } catch {
//       return null;
//     }
//   })
//   .filter(Boolean) as ILayer[];
// const groups: ILayerGroup[] = order.map(x => ({
//   layers: layers.filter(f => f!.id.startsWith(x.id)),
//   ...x,
// }));

// export function finalizeImage(image: IImage, width: number, height: number): IImage {
//   return {
//     ...image,
//     content: image.content.replace('__[W]__', width.toString()).replace('__[H]__', height.toString()),
//   };
// }

// export function getRandomVariants(count: number): IImage[] {
//   return Array.from({ length: count }, () => createImage(getRandomCombination(groups).map(x => x.id))); // cartesianProduct(groups);
// }

// export function getLayerGroups() {
//   return groups;
// }

// export function createImage(layerIds: string[], name?: string): IImage {
//   const orderedIds = groups.map(g => layerIds.find(x => x.startsWith(g.id))!).filter(Boolean);

//   return {
//     content: `<svg width="__[W]__" height="__[H]__" viewBox="0 0 1660 1660" fill="none" xmlns="http://www.w3.org/2000/svg">
//     ${orderedIds
//       .map(x => layers.find(f => f.id === x)!)
//       .filter(Boolean)
//       .map(x => x!.body)
//       .join('\n')}
//   </svg>`,
//     layers: layerIds,
//     id: name || layerIds.join('::'),
//   };
// }

// export function saveToFile(_image: IImage, width: number, height: number) {
//   const image = finalizeImage(_image, width, height);

//   writeFileSync(path.join(resultsDir, image.id + '.svg'), image.content);
//   sharp(path.join(resultsDir, image.id + '.svg'))
//     .resize(width, height)
//     .toFile(path.join(resultsDir, image.id + '.png'));
// }

// function saveToHTML(combinations: ILayer[][]) {
//   const content = combinations.map((g, i) => {
//     const body = g.map(x => x!.body).join('\n');
//     const name = g.map(x => x?.id).join('_');
//     return {
//       body: `<svg width="400" height="400" viewBox="0 0 1660 1660" fill="none" xmlns="http://www.w3.org/2000/svg">
//     ${body}
//   </svg>`,
//       name,
//     };
//   });

//   writeFileSync(
//     path.join(resultsDir, 'result.html'),
//     `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title> </head> <body>
//     ${content.map(x => x.body + '</br>' + x.name + '</br>').join('</br>')}
//     </body> </html>`,
//   );
// }

// function cartesianProduct<T>(arr: T[][], acc: T[][] = []): T[][] {
//   if (arr.length === 0) {
//     return acc;
//   } else {
//     const [arr1, ...arrTail] = arr;
//     return cartesianProduct(
//       arrTail,
//       acc.length === 0 ? arr1.map(x => [x]) : arr1.flatMap(a => acc.map(ac => [...ac, a])),
//     );
//   }
// }

// function shuffleArray<T>(_arr: T[]): T[] {
//   const arr = _arr.slice();
//   let currentIndex = arr.length;
//   let randomIndex;

//   // While there remain elements to shuffle...
//   while (currentIndex != 0) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;

//     // And swap it with the current element.
//     [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
//   }

//   return arr;
// }

// function getRandomCombination<T>(groups: { probability: number; layers: T[] }[]): T[] {
//   return groups
//     .map(x => {
//       const rand = Math.random();

//       if (rand <= x.probability) {
//         return x.layers[Math.floor(Math.random() * x.layers.length)];
//       } else {
//         return null;
//       }
//     })
//     .filter(Boolean) as T[];
// }

// export function layerSequenceFromString(str: string): ISequence {
//   return str.split(' ').map((x, i) => {
//     const [filenamePrefix, probability] = x.split('_');
//     return { filenamePrefix, probability: Number(probability), order: i };
//   });
// }
