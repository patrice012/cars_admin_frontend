export type Brand = {
  _id: string;
  name: string;
  logo: string;
  active: boolean;
};

export type Seller = {
  _id: string;
  firstname: string;
  lastname: string;
  phone: string;
  whatsapp: string;
  isActive:boolean;
  sellerType:string;
};
