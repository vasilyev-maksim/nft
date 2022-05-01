import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { CollectionProvider } from './CollectionProvider';
import { join } from 'path';
// import morgan from 'morgan';
import { ICollectionConfig, ISVGTemplate, IidBuilder, IRandomImages, ICollections, Iid } from 'shared';
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
const collections = new CollectionProvider(collectionsDir);

// middlewares
function populateRequest(req: Request, res: Response, next: NextFunction) {
  try {
    req.iid = req.body.iid ? new IidBuilder().fromIdString(req.body.iid).build() : undefined;
    const collectionId = req.iid?.collection || req.body.collection || req.query.collection || req.params.collection;
    req.collection = collections.findCollection(collectionId);
  } catch (e) {}
  next();
}

const app = express();
const port = 3002;

// app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(populateRequest);

app.get('/collection', (req, res) => {
  res.json(req.collection?.toJSON() as ICollectionConfig);
});

app.get('/collections/name', (req, res) => {
  res.json(collections.getCollectionNames() as ICollections);
});

app.post('/image/save', (req, res) => {
  const filename = req.body.filename || req.iid!.id;
  req.collection!.saveImage(req.iid!, filename);
  res.send(200);
});

app.post('/image/preview', ({ iid, collection }, res) => {
  const image = collection!.getImageByIid(iid!);
  res.json(image?.toSvgTemplate() as ISVGTemplate);
});

app.get('/images/random', ({ collection, query }, res) => {
  const count = parseInt(query.count?.toString() ?? '200') || 200;
  const randomIds = Array.from({ length: count }, () => collection!.getRandomImageIid()).map(x => x.id);
  res.json(randomIds as IRandomImages);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
