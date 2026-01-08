"use client";

import { BookForm } from "@/app/lib/Forms";

export default function Page() {
    return (
        <BookForm
            formState={{
                _id: { $oid: "" },
                name: "",
                isbn: "",
                authors: [],
                edition: 0,
                volume: 0,
                owned: false,
                read: false,
                created_at: { $date: "" },
                updated_at: { $date: "" },
            }}
            title="Create A Book"
            method="post"
        />
    );
}
