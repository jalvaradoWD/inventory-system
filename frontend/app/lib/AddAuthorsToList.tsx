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
    const [authorInput, setAuthorInput] = useState<string>("");

    const AddAuthor = (e: React.KeyboardEvent<HTMLInputElement>) => {
        try {
            if (e.key === "Enter") {
                if (authorInput.length > 0) {
                    props.setFormState({
                        ...props.formState,
                        authors: [
                            ...props.formState.authors,
                            authorInput,
                        ],
                    });

                    setAuthorInput("");
                } else {
                    throw new Error("No Input Detected for the author.");
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    };

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
                    onKeyDown={AddAuthor}
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
