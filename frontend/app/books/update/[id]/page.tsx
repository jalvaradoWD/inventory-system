import { BookForm, IBookForm } from "@/app/lib/Forms";
import { IAPIResponse, IBook } from "@/app/lib/types";
import { baseUrl } from "@/app/lib/vars";

export default async function Page(props: PageProps<"/books/update/[id]">) {
    const { id: book_id } = await props.params;
    const response: IAPIResponse<IBook> =
        await (await fetch(`${baseUrl}/books/${book_id}`))
            .json();

    return (
        <>
            <BookForm
                formState={response.body}
                title="Update Book"
                method="put"
            />
        </>
    );
}
