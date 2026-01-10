import { FormEvent } from "react";
import { baseUrl } from "./vars";
import { IBookForm } from "./Forms";
import { redirect } from "next/navigation";

interface IResponseError {
    detail: Detail[];
}

interface Detail {
    type: string;
    loc: string[];
    msg: string;
    input: null | string;
    ctx?: Ctx;
}

interface Ctx {
    min_length: number;
}

class ResponseError extends Error {
    responseMessage: IResponseError;

    constructor(
        responseMessage: IResponseError,
    ) {
        super();
        this.responseMessage = responseMessage;
    }
}

export async function onBookSubmit(
    e: FormEvent<HTMLFormElement>,
    formState: IBookForm,
    method: "post" | "put",
) {
    e.preventDefault();
    let ifError = true;

    try {
        const {
            name,
            isbn,
            authors,
            edition,
            volume,
            read,
            owned,
            updated_at,
            created_at,
        } = formState;

        let requestUrl: string = "";
        let body;

        if (method === "post") {
            requestUrl = `${baseUrl}/books`;
            body = { name, isbn, authors, edition, volume, read, owned };
        } else if (method === "put") {
            requestUrl = `${baseUrl}/books/${formState._id?.$oid}`;
            body = {
                name,
                isbn,
                authors,
                edition,
                volume,
                read,
                owned,
                created_at: created_at.$date,
                updated_at: updated_at.$date,
            };
        }

        const res = await fetch(requestUrl, {
            method,
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.status === 422) {
            ifError = false;
            throw new ResponseError(await res.json());
        }
    } catch (e) {
        if (e instanceof ResponseError) {
            console.error("This is a response error", e.responseMessage);
        }
    }
    if (ifError) {
        redirect("/books");
    }
}
