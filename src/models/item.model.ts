import Brand from "./brand.model";

type Item = {
  _id: string;
  title: string;
  description?: string;
  brand: Brand;
  photos: string[];
  videos?: string[];
  active: boolean;
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
