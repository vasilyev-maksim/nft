import { ILayer } from './Layer';

export interface ICategory {
  id: string;
  name: string;
  probability: number;
  layers: ILayer[];
}

export interface ICollectionConfig {
  categories: ICategory[];
  name: string;
}

export interface ISVGTemplate {
  text: string;
  placeholders: {
    width: string;
    height: string;
  };
}

export type ICollections = string[];
export type IRandomImages = string[];
