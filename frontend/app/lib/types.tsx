export interface IBook {
  _id: {
    $oid: string;
  };
  name: string;
  isbn: string;
  authors: string[];
  owned: boolean;
  read: boolean;
  volume: number;
  edition: number;

  created_at: {
    $date: Date | string;
  };
  updated_at: {
    $date: Date | string;
  };
}

export class Book implements IBook {
  public _id: { $oid: string } = { $oid: "" };
  public name: string = "";
  public isbn: string = "";
  public authors: string[] = [];
  public owned: boolean = false;
  public read: boolean = false;
  public volume: number = 0;
  public edition: number = 0;
  public created_at: { $date: Date | string } = { $date: new Date() };
  public updated_at: { $date: Date | string } = { $date: new Date() };
}

export interface IAPIResponse<T> {
  message: string;
  body: T;
  status_code: number;
}

export interface IErrorResponse {
  detail: Detail[];
}

export interface Detail {
  type: string;
  loc: string[];
  msg: string;
  input: null | string;
  ctx?: Ctx;
}

export interface Ctx {
  min_length: number;
}
