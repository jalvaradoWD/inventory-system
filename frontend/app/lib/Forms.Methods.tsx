import { redirect } from "next/navigation";
import { FormEvent } from "react";
import { IAPIResponse, IBook, IErrorResponse } from "./types";
import { baseUrl } from "./vars";

class APIResponseError extends Error {
    responseMessage: IAPIResponse<IErrorResponse>;

    constructor(
        responseMessage: IAPIResponse<IErrorResponse>,
    ) {
        super();
        this.responseMessage = responseMessage;
    }
}

export async function onBookSubmit(
    e: FormEvent<HTMLFormElement>,
    formState: IBook,
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
            let res_json: IAPIResponse<IErrorResponse> = await res.json();
            throw new APIResponseError(res_json);
        }
    } catch (e) {
        if (e instanceof APIResponseError) {
            console.error("This is a response error", e.responseMessage);
        }
    }
    if (ifError) {
        redirect("/books");
    }
}

export const deleteBook = async (
    item: any,
    booksState: any,
    useBooksState: any,
) => {
    await fetch(`${baseUrl}/books/${item._id.$oid}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    useBooksState(
        booksState.filter((book: IBook) => book._id.$oid !== item._id.$oid),
    );
};
