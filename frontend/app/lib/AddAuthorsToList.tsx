"use client";
import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import { IBook } from "./types";

export function AddAuthorsToList(
    props: PropsWithChildren<
        {
            authors: string[];
            setFormState: Dispatch<SetStateAction<IBook>>;
            onInputFieldChange: Function;
            formState: IBook;
            borderStyles: string;
        }
    >,
) {
    const [authorInput, setAuthorInput] = useState<string>("");
    let name = "author";

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
                <input
                    form="authors-form"
                    type="text"
                    name="author"
                    className="input"
                    onChange={(e) => {
                        e.preventDefault();
                        setAuthorInput(e.target.value);
                    }}
                    onKeyDown={AddAuthor}
                    value={authorInput}
                    minLength={0}
                    required
                    placeholder={name.charAt(0).toUpperCase() +
                        name.slice(1).toLowerCase()}
                />
            </div>
            <h2 className="underline">Current Authors:</h2>
            <ul className="list bg-base-100 rounded-box shadow-md">
                {props.formState.authors.map((author, i) => {
                    return (
                        <li key={`${i}-${author}`} className="list-row">
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

                                    props.setFormState({
                                        ...props.formState,
                                        authors: [...props.formState.authors],
                                    });
                                }}
                                className="btn btn-error size-fit"
                            >
                                Delete
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
