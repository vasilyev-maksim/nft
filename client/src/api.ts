import { ICollectionConfig, ICollections, Iid, IidBuilder, IRandomImages, ISVGTemplate } from 'shared';

const baseUrl = 'http://localhost:3002';

export async function getRandomImages(count: number, collection: string): Promise<Iid[]> {
  const data: IRandomImages = await (
    await fetch(baseUrl + `/images/random?count=${count}&collection=${collection}`)
  ).json();
  return data.map(x => new IidBuilder().fromIdString(x).build());
}

export function generate(iid: Iid, filename?: string, size?: number) {
  return fetch(baseUrl + '/image/save', {
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
  return fetch(baseUrl + '/collection?collection=' + collection).then(x => x.json());
}

export function getCollections(): Promise<ICollections> {
  return fetch(baseUrl + '/collections/name').then(x => x.json());
}
