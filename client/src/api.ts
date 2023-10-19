import * as shared from 'shared';

const baseUrl = import.meta.env.VITE_API_URL;

export async function getRandomImages(count: number, collection: string): Promise<shared.Iid[]> {
  const data: shared.IRandomImages = await (
    await fetch(baseUrl + `/images/random?count=${count}&collection=${collection}`)
  ).json();
  return data.map(x => new shared.IidBuilder().fromIdString(x).build());
}

export function generate(iid: shared.Iid, filename?: string) {
  return fetch(baseUrl + '/image/save', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ iid, filename }),
  });
}

export function getPreviewUrl(iid: shared.Iid): string {
  return baseUrl + '/image/preview/' + encodeURIComponent(iid.id);
}

export function getCollectionConfig(collection: string): Promise<shared.ICollectionConfig> {
  return fetch(baseUrl + '/collection/' + collection).then(x => x.json());
}

export function getCollections(): Promise<shared.ICollections> {
  return fetch(baseUrl + '/collections/name').then(x => x.json());
}
