import { join } from 'path';
import { Directory } from './Directory';
import { NFTGenerator } from './NFTGenerator';
import sharp from 'sharp';

// converts particular svg to png

const collectionsDir = new Directory(join(__dirname, '..', 'collections'));
const generator = new NFTGenerator(collectionsDir);

const layerFiles = generator.getCollections().flatMap(c => c.getCategories().flatMap(x => x.getAll().map(y => y.file)));

// const target = layerFiles.find(x => x.name.includes('ptrn'))!;
// const dest = target.fid.getSiblingFid(target.name + '.png'); // TODO:
layerFiles.forEach(x => {
  sharp(x.path).resize(1000, 1000).png().toFile(x.withExt('png').path);
});

// console.log(dest.path);
// const face1 = layerFiles.find(x => x.fullName.startsWith('face1'))!;
// const bg1 = layerFiles.find(x => x.fullName.startsWith('back1'))!;

// sharp(face1.fid.path)
//   .png()
//   // .composite([
//   //   { input: face1.fid.getSiblingFid(face1.name + '.png').path },
//   //   { input: bg1.fid.getSiblingFid(bg1.name + '.png').path },
//   // ])
//   .toFile('./test.png')
//   .catch(x => console.error('>--- ', x))
//   .then(() => console.log('end'));

// sharp({
//   create: {
//     width: 2000,
//     height: 2000,
//     channels: 4,
//     background: { r: 0, g: 0, b: 0, alpha: 1 },
//   },
// })
//   .png()
//   .composite([{ input: bg1.withExt('png').path }, { input: face1.withExt('png').path }])
//   .toFile('./test.png')
//   .catch(x => console.error('>--- ', x))
//   .then(() => console.log('end'));

// find ./collections -type f -name '[0-9]*.svg' -delete
