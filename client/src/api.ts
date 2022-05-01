import { ICollectionConfig, ICollections, Iid, IRandomImages, ISVGTemplate } from 'shared';

const baseUrl = 'http://localhost:3002';

export function getRandomImages(count: number, collection: string): Promise<IRandomImages> {
  return fetch(baseUrl + `/images/random?count=${count}&collection=${collection}`).then(x => x.json());
}

export function generate(iid: Iid, filename?: string, size?: number) {
  return fetch(baseUrl + '/ima  ge/save', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ iid, filename, width: size, height: size }),
  });
}

export function preview(iid: Iid): Promise<ISVGTemplate> {
  return fetch(baseUrl + '/image/preview', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ iid }),
  }).then(x => x.json());
}

export function getCollectionConfig(collection: string): Promise<ICollectionConfig> {
  return fetch(baseUrl + `/collection/` + collection).then(x => x.json());
}

export function getCollections(): Promise<ICollections> {
  return fetch(baseUrl + `/collections/name`).then(x => x.json());
}
