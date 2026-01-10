"use client";
import Link from "next/link";
import { baseUrl } from "../lib/vars";
import { useEffect, useState } from "react";
import { deleteBook } from "../lib/Forms.Methods";

export interface IBook {
  _id: {
    $oid: string;
  };
  name: string;
  isbn: string;
  authors: string[];
  owned: boolean;
  read: boolean;
  volume: number;
  edition: number;

  created_at: {
    $date: Date;
  };
  updated_at: {
    $date: Date;
  };
}

export default function Home() {
  // const data = await fetch(`${baseUrl}/books`);
  // const books: IBook[] = await data.json();
  const [booksState, useBooksState] = useState<IBook[]>([]);

  const fetchData = async () => {
    const data = await fetch(`${baseUrl}/books`);
    const books: IBook[] = await data.json();
    useBooksState(books);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h1 className="text-4xl">Books Home Page</h1>
      <ul>
        {booksState.map((item: IBook) => {
          item.created_at.$date = new Date(item.created_at.$date);
          item.updated_at.$date = new Date(item.updated_at.$date);
          return (
            <li className="mt-4 mx-2 p-4 border-4" key={item._id.$oid}>
              <h1 className="text-3xl">{item.name}</h1>
              <h2>
                <Link href={`/books/update/${item._id.$oid}`}>
                  {item._id.$oid}
                </Link>
              </h2>
              <ul>
                {item.authors.map((author) => {
                  return <li key={`${item._id.$oid}-${author}`}>- {author}</li>;
                })}
              </ul>
              <p>Created At: {item.created_at.$date.toUTCString()}</p>
              <p>Update At: {item.updated_at.$date.toUTCString()}</p>
              <button
                className="border rounded-4xl bg-red-400 text-white p-2"
                onClick={() => deleteBook(item, booksState, useBooksState)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
