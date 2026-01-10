"use client";
import {
    ChangeEventHandler,
    FormEvent,
    PropsWithChildren,
    useState,
} from "react";
import { AddAuthorsToList } from "./AddAuthorsToList";
import { onBookSubmit } from "./Forms.Methods";
import Link from "next/link";

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
                    className={className}
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
                    value={value}
                    checked={checked}
                />
            );
        }
    };

    return (
        <section className="block">
            <label htmlFor={name}>
                {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}:
            </label>
            {renderOnType(type)}
        </section>
    );
}

export function BookForm(
    props: { formState: IBookForm; title: string; method: "post" | "put" },
) {
    const inputBorderStyles = "border border-gray-500";
    const [formState, setFormState] = useState<IBookForm>(props.formState);

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
            {renderDate(formState.created_at?.$date, "Created At")}
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
