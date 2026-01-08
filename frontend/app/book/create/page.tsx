"use client";

import {
    ChangeEventHandler,
    FormEvent,
    PropsWithChildren,
    useState,
} from "react";
import { AddAuthorsToList } from "../../lib/AddAuthorsToList";

export interface IBookFormState {
    name: string;
    isbn: string;
    authors: string[];
    owned: boolean;
    read: boolean;
    volume: number;
    edition: number;
}

export const inputBorderStyles = "border border-gray-500";

export default function CreateBook() {
    const [formState, setFormState] = useState<IBookFormState>({
        name: "",
        isbn: "",
        authors: ["test author"],
        owned: false,
        read: false,
        volume: 0,
        edition: 0,
    });

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const dat = new FormData();
        console.log(dat);
        const res = await fetch("http://localhost:8000/books", {
            method: "post",
            body: JSON.stringify(formState),
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log(await res.json());
        console.log(formState);
    }

    const OnInputFieldChange = (e: FormEvent<HTMLInputElement>) => {
        const a = e.currentTarget;
        if (a.type === "text") {
            console.log(a.value);
            setFormState({ ...formState, [a.name]: a.value });
        } else if (a.type === "checkbox") {
            console.log(a.checked);
            setFormState({ ...formState, [a.name]: a.checked });
        } else if (a.type === "number") {
            console.log(a.value);
            setFormState({ ...formState, [a.name]: Number(a.value) });
        }
    };

    return (
        <>
            <h1 className="text-3xl">Create Book Page</h1>

            <form onSubmit={onSubmit}>
                <InputField
                    type="text"
                    name="name"
                    onChange={OnInputFieldChange}
                    value={formState.name}
                    className={inputBorderStyles}
                />
                <InputField
                    type="text"
                    name="isbn"
                    onChange={OnInputFieldChange}
                    value={formState.isbn}
                    className={inputBorderStyles}
                />
                <InputField
                    type="checkbox"
                    name="owned"
                    onChange={OnInputFieldChange}
                />
                <InputField
                    type="checkbox"
                    name="read"
                    onChange={OnInputFieldChange}
                />
                <InputField
                    type="number"
                    name="volume"
                    onChange={OnInputFieldChange}
                    value={formState.volume}
                    className={inputBorderStyles}
                    min={0}
                />
                <InputField
                    type="number"
                    name="edition"
                    onChange={OnInputFieldChange}
                    value={formState.edition}
                    className={inputBorderStyles}
                    min={0}
                />
                <AddAuthorsToList
                    authors={formState.authors}
                    setFormState={setFormState}
                    onInputFieldChange={OnInputFieldChange}
                    formState={formState}
                />
                <input
                    className="block border bg-blue-400 text-white p-2 text-base rounded-lg"
                    type="submit"
                    value="Submit"
                />
            </form>
        </>
    );
}

function InputField(
    props: PropsWithChildren<
        {
            type: "text" | "checkbox" | "number";
            name: string;
            onChange: ChangeEventHandler<HTMLInputElement>;
            min?: number;
            value?: string | number;
            className?: string;
        }
    >,
) {
    const { name, type, onChange, min, value, className } = props;

    const renderOnType = (type: "text" | "checkbox" | "number") => {
        if (type === "number") {
            return (
                <input
                    type={type}
                    name={name}
                    id={name}
                    onChange={onChange}
                    min={min}
                    value={value}
                />
            );
        } else {
            return (
                <input
                    type={type}
                    name={name}
                    id={name}
                    onChange={onChange}
                    className={className}
                />
            );
        }
    };

    return (
        <section className="block">
            <label htmlFor={name}>{name}:</label>
            {renderOnType(type)}
        </section>
    );
}
