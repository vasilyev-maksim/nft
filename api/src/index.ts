import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { CollectionProvider } from './CollectionProvider';
import { FileSystem } from './FileSystem';
import { join } from 'path';
import morgan from 'morgan';
import { ICollectionConfig, Iid, ISVGTemplate, IidBuilder, IRandomImages, ICollections } from 'shared';

// TODO: move 'join' and __dirname to FileSystem
const collectionsDir = new FileSystem().getDirectory(join(__dirname, '..', 'collections'));
const collections = new CollectionProvider(collectionsDir);

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

app.get('/collection/:name', (req, res) => {
  const collection = collections.findCollection(req.params.name);
  res.json(collection?.toJSON() as ICollectionConfig);
});

app.post('/image/save', (req, res) => {
  const iid = new IidBuilder().fromIdString(req.body.iid).build();
  const filename = req.body.filename || iid.id;
  const collection = collections.findCollection(iid.collection);

  collection?.saveImage(iid);

  res.send(200);
});

// TODO: middlewares

app.post('/image/preview', (req, res) => {
  const iid = new IidBuilder().fromIdString(req.body.iid).build();
  const collection = collections.findCollection(iid.collection);
  const image = collection?.getImageByIid(iid);
  res.json(image?.toSvgTemplate() as ISVGTemplate);
});

app.get('/images/random', (req, res) => {
  const count = parseInt(req.query.count?.toString() ?? '200') || 200;
  const collection = collections.findCollection(req.query.collection?.toString() ?? '')!;
  const randomIds = Array.from({ length: count }, () => collection.getRandomImageIid()).map(x => x.id);
  res.json(randomIds as IRandomImages);
});

app.get('/collections/name', (req, res) => {
  res.json(collections.getCollectionNames() as ICollections);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
