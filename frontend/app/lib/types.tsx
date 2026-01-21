export type IBookProperties = { [name: string]: boolean }[];

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

export class Book {
  [key: string]: any;
  public _id?: string = "";
  public name?: string = "";
  public isbn?: string = "";
  public authors?: string[] = [];
  public owned?: boolean | string = false;
  public read?: boolean | string = false;
  public volume?: number = 0;
  public edition?: number = 0;
  public created_at?: Date | string = new Date();
  public updated_at?: Date | string = new Date();
  constructor(
    _id?: string,
    name?: string,
    isbn?: string,
    authors?: string[],
    owned?: boolean | string,
    read?: boolean | string,
    volume?: number,
    edition?: number,
    created_at?: Date | string,
    updated_at?: Date | string,
  ) {
    this._id = _id;
    this.name = name;
    this.isbn = isbn;
    this.authors = authors;
    this.owned = owned;
    this.read = read;
    this.volume = volume;
    this.edition = edition;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  public convertIBook(book: IBook): Book {
    let newBook = new Book(
      book._id.$oid,
      book.name,
      book.isbn,
      book.authors,
      book.owned.toString(),
      book.read.toString(),
      book.volume,
      book.edition,
      book.created_at.$date.toString(),
      book.updated_at.$date.toString(),
    );

    return newBook;
  }
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
