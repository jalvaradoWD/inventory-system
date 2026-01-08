import { FormEvent } from "react";
import { baseUrl } from "./vars";
import { IBookForm } from "./Forms";
import { redirect } from "next/navigation";

export async function onBookSubmit(
    e: FormEvent<HTMLFormElement>,
    formState: IBookForm,
    method: "post" | "put",
) {
    e.preventDefault();

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

    await fetch(requestUrl, {
        method,
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return redirect("/books");
}
