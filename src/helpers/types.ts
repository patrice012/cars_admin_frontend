export type ResponseData = {
  status: number;
  data: object;
};

export interface extrasProps {
  key: string;
  value: string;
}

export interface subItemProps {
  _id: string;
  value: string;
}

export interface characsItemProps {
  _id: string;
  name: string;
  firstname: string;
  lastname: string;
}

export interface requestProps {
  data: any;
  url: string;
  isFileUpload?: boolean;
  extras?: extrasProps[];
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password?: string;
  createdAt: string;
}
