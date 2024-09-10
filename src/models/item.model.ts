import {Brand, Seller}from "./brand.model";

interface ItemType {
  name: string;
  _id: string;
}

type Item = {
  _id: string;
  name: string,
  model: ItemType,
  color: ItemType,
  engineType: ItemType,
  transmission: ItemType,
  fuelType: ItemType,
  title: ItemType,
  city: ItemType,
  seller: Seller,
  cylinders: number,
  year: number,
  brand: Brand,
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
