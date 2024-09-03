import {Brand, Seller}from "./brand.model";

interface ItemType {
  name: string;
  _id: string;
}

type Item = {
  _id: string;
  name: string,
  modelId: ItemType,
  colorId: ItemType,
  engineTypeId: ItemType,
  transmissionId: ItemType,
  fuelTypeId: ItemType,
  titleId: ItemType,
  cityId: ItemType,
  sellerId: Seller,
  cylinders: number,
  year: number,
  brandId: Brand,
  doorsCount: number,
  odometer: number,
  salesPrice: number,
  minPrice: number,
  imagesUrls: string[],
  keywords: string[],
  isElectric: boolean,
  isHybrid: boolean,
  note: string,
};

export interface ItemData {
  _id: string;
  title: string;
  description?: string;
  brand: string;
  photos: string[];
  videos?: string[];
  active: boolean;
}

export default Item;
