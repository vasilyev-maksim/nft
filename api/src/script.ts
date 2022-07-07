import { join } from 'path';
import { Directory } from './Directory';
import { NFTGenerator } from './NFTGenerator';
import sharp from 'sharp';

// converts particular svg to png

const collectionsDir = new Directory(join(__dirname, '..', 'collections'));
const generator = new NFTGenerator(collectionsDir);

const layerFiles = generator.getCollections().flatMap(c => c.getCategories().flatMap(x => x.getAll().map(y => y.file)));
const target = layerFiles.find(x => x.name.includes('ptrn'))!;
const dest = target.fid.getSiblingFid(target.name + '.png'); // TODO:

sharp(target.fid.path).resize(1000, 1000).png().toFile(dest.path);

console.log(dest.path);
