import { BookForm, IBookForm } from "@/app/lib/Forms";
import { baseUrl } from "@/app/lib/vars";

export default async function Page(props: PageProps<"/books/update/[id]">) {
    const { id: book_id } = await props.params;
    const book_data: IBookForm =
        await (await fetch(`${baseUrl}/books/${book_id}`))
            .json();

    console.log(book_data);
    return (
        <>
            <BookForm formState={book_data} title="Update Book" method="put" />
        </>
    );
}
