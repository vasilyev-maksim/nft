import { Iid } from 'shared';

export interface ILayerGroup {
  id: string;
  probability: number;
  layers: number[];
}

export interface ICollectionConfig {
  groups: ILayerGroup[];
  name: string;
}

export interface SVGTemplate {
  text: string;
  placeholders: {
    width: string;
    height: string;
  };
}

const baseUrl = 'http://localhost:3002';

export function getRandomImages(count: number, collection: string): Promise<string[]> {
  return fetch(baseUrl + `/images/random?count=${count}&collection=${collection}`).then(x => x.json());
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

export function preview(iid: Iid): Promise<SVGTemplate> {
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

export function getCollections(): Promise<string[]> {
  return fetch(baseUrl + `/collections/name`).then(x => x.json());
}
