import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { NFTGenerator } from './NFTGenerator';
import { join } from 'path';
import morgan from 'morgan';
import { ICollectionConfig, IidBuilder, IRandomImages, ICollections, Iid } from 'shared';
import { Directory } from './Directory';
import { Collection } from './Collection';

declare global {
  namespace Express {
    interface Request {
      iid?: Iid;
      collection?: Collection;
    }
  }
}

const collectionsDir = new Directory(join(__dirname, '..', 'collections'));
const generator = new NFTGenerator(collectionsDir);

const app = express();
const port = 3002;

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get('/collection/:collection', (req, res) => {
  const collection = req.params.collection ? generator.findCollection(req.params.collection.toString()) : undefined;
  res.json(collection?.toJSON() as ICollectionConfig);
});

app.get('/collections/name', (req, res) => {
  res.json(generator.getCollectionNames() as ICollections);
});

app.post('/image/save', (req, res) => {
  const iid = req.body.iid ? new IidBuilder().fromIdString(req.body.iid).build() : undefined;
  const collection = iid?.collection ? generator.findCollection(iid.collection) : undefined;
  const filename = req.body.filename || iid?.id;

  collection!.saveImage(iid!, filename);
  res.send(200);
});

app.get('/image/preview/:iid', (req, res) => {
  const iid = req.params.iid ? new IidBuilder().fromIdString(req.params.iid).build() : undefined;
  const collection = iid?.collection ? generator.findCollection(iid.collection) : undefined;
  const image = collection!.getImageByIid(iid!);
  console.log(iid?.width, iid?.height);
  image?.toPngBuffer().then(x => res.type('png').send(x));
});

app.get('/images/random', (req, res) => {
  const collection = req.query.collection ? generator.findCollection(req.query.collection.toString()) : undefined;
  const count = parseInt(req.query.count?.toString() ?? '200') || 200;
  const randomIds = Array.from({ length: count }, () => collection!.getRandomImageIid()).map(x => x.id);
  res.json(randomIds as IRandomImages);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
