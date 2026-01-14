"use client";
import Link from "next/link";
import {
    ChangeEventHandler,
    FormEvent,
    PropsWithChildren,
    useState,
} from "react";
import { AddAuthorsToList } from "./AddAuthorsToList";
import { onBookSubmit } from "./Forms.Methods";
import { IBook } from "./types";

export interface IBookForm {
    _id?: {
        $oid: string;
    };
    name: string;
    isbn: string;
    authors: string[];
    owned: boolean;
    read: boolean;
    volume: number;
    edition: number;
    created_at: { $date: string };
    updated_at: { $date: string };
}

export function InputField(
    props: PropsWithChildren<
        {
            type: "text" | "checkbox" | "number";
            name: string;
            onChange: ChangeEventHandler<HTMLInputElement>;
            min?: number;
            value?: string | number;
            className?: string;
            checked?: boolean;
        }
    >,
) {
    const { name, type, onChange, min, value, className, checked } = props;

    const renderOnType = (type: "text" | "checkbox" | "number") => {
        if (type === "number") {
            return (
                <input
                    type={type}
                    name={name}
                    id={name}
                    onChange={onChange}
                    value={value}
                    className="input"
                    min={0}
                    placeholder={name}
                />
            );
        } else if (type === "checkbox") {
            return (
                <>
                    <label htmlFor={name} className="label">
                        <input
                            type="checkbox"
                            className="checkbox"
                            id={name}
                            name={name}
                            onChange={onChange}
                            value={value}
                            checked={checked}
                            placeholder={name.charAt(0).toUpperCase() +
                                name.slice(1).toLowerCase()}
                        />
                        {name}
                    </label>
                </>
            );
        } else {
            return (
                <input
                    type={type}
                    name={name}
                    id={name}
                    onChange={onChange}
                    className="input"
                    value={value}
                    checked={checked}
                    placeholder={name.charAt(0).toUpperCase() +
                        name.slice(1).toLowerCase()}
                />
            );
        }
    };

    return (
        <section className="block">
            {renderOnType(type)}
        </section>
    );
}

export function BookForm(
    props: { formState: IBook; title: string; method: "post" | "put" },
) {
    const inputBorderStyles = "border border-gray-500";
    const [formState, setFormState] = useState<IBook>(props.formState);

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

    const renderDate = (date: string | undefined, labelText: string) => {
        if (date) {
            return (
                <section>
                    <label htmlFor={labelText}>
                        <strong>{labelText}</strong>
                    </label>
                    <p id={labelText}>{new Date(date).toString()}</p>
                </section>
            );
        }

        return;
    };

    return (
        <>
            <h1 className="text-3xl">{props.title}</h1>
            {renderDate(formState.created_at?.$date.toString(), "Created At")}
            <form onSubmit={(e) => onBookSubmit(e, formState, props.method)}>
                <h2 className="text-4xl">{formState.name}</h2>
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
                    borderStyles={inputBorderStyles}
                />
                <InputField
                    type="checkbox"
                    name="owned"
                    onChange={OnInputFieldChange}
                    checked={formState.owned}
                />
                <InputField
                    type="checkbox"
                    name="read"
                    onChange={OnInputFieldChange}
                    checked={formState.read}
                />
                <Link
                    className="block border bg-red-400 text-white p-2 text-base rounded-lg w-fit"
                    href="/books"
                >
                    Cancel
                </Link>
                <input
                    className="block border bg-blue-400 text-white p-2 text-base rounded-lg"
                    type="submit"
                    value="Submit"
                />
            </form>
        </>
    );
}
