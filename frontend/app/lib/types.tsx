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
