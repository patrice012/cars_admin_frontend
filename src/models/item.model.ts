import { Brand, Seller } from "./brand.model";

interface ItemType {
  name: string;
  _id: string;
}

type Item = {
  isActive: boolean;
  _id: string;
  name_en: string;
  name: string;
  name_fr: string;
  model: ItemType;
  color: ItemType;
  engineType: ItemType;
  transmission: ItemType;
  fuelType: ItemType;
  title: ItemType;
  city: ItemType;
  seller: Seller;
  cylinders: number;
  year: number;
  brand: string;
  doorsCount: number;
  odometer: number;
  salesPrice: number;
  minPrice: number;
  imagesUrls: string[];
  keywords: string[];
  isElectric: boolean;
  isHybrid: boolean;
  note_en: string;
  note_fr: string;
  note: string;
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
