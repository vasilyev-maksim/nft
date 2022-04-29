import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { CollectionProvider } from './CollectionProvider';
import { FileSystem } from './FileSystem';
import { join } from 'path';
import morgan from 'morgan';
import { Iid } from 'shared';

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
  res.json(collection);
});

app.post('/image/save', (req, res) => {
  const iid = new Iid(req.body.iid);
  const filename = req.body.filename || iid.id;
  const collection = collections.findCollection(iid.collection);

  collection?.saveImage(iid);

  res.send(200);
});

// TODO: middlewares

app.post('/image/preview', (req, res) => {
  const iid = new Iid(req.body.iid);
  // iid.addLayer[Symbol]..
  const collection = collections.findCollection(iid.collection);
  const image = collection?.getImageByIid(iid);
  res.json(image?.toSvgTemplate());
});

app.get('/images/random', (req, res) => {
  const count = parseInt(req.query.count?.toString() ?? '200') || 200;
  const collection = collections.findCollection(req.query.collection?.toString() ?? '');
  const randomIids = Array.from({ length: count }, () => collection?.getRandomImageIid());
  res.json(randomIids);
});

app.get('/collections/name', (req, res) => {
  res.json(collections.getCollectionNames());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
