"use client";
import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { IBookForm } from "./Forms";

export function AddAuthorsToList(
    props: PropsWithChildren<
        {
            authors: string[];
            setFormState: Dispatch<SetStateAction<IBookForm>>;
            onInputFieldChange: Function;
            formState: IBookForm;
            borderStyles: string;
        }
    >,
) {
    // TODO: There is a bug where you press enter, it deletes the first author.
    const [authorInput, setAuthorInput] = useState<string>("");

    return (
        <section id="authors-form">
            <div className="block">
                <label htmlFor="author">Author:</label>
                <input
                    form="authors-form"
                    type="text"
                    name="author"
                    className={props.borderStyles}
                    onChange={(e) => {
                        e.preventDefault();
                        setAuthorInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        // This is the submission code for just the array of authors.
                        if (e.key === "Enter") {
                            // When pressing the enter key, the value of the input tag will be added as an authoer to the author array.
                            props.setFormState({
                                ...props.formState,
                                authors: [
                                    ...props.formState.authors,
                                    authorInput,
                                ],
                            });

                            setAuthorInput("");
                        }
                    }}
                    value={authorInput}
                    minLength={0}
                    required
                />
            </div>
            <h2 className="underline">Current Authors:</h2>
            <ul className="list-disc">
                {props.formState.authors.map((author, i) => {
                    return (
                        <li key={`${i}-${author}`}>
                            {author}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();

                                    const authorsArray =
                                        props.formState.authors;

                                    authorsArray.splice(
                                        authorsArray.indexOf(author),
                                        1,
                                    );

                                    console.log(
                                        "Button Clicked",
                                        author,
                                        authorsArray.indexOf(author),
                                    );

                                    props.setFormState({
                                        ...props.formState,
                                        authors: [...props.formState.authors],
                                    });
                                }}
                                className="bg-red-600 text-white rounded-3xl p-1 text-sm hover:cursor-pointer"
                            >
                                X
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
