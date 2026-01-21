"use client";
import { useEffect, useState } from "react";
import {
  BooksTable,
  fetchData,
  limitNumbers,
  LimitSelection,
  maxPages,
  Paginiation,
  SearchBar,
  TogglePropertyVisibility,
} from "../lib/Books.Components";
import { IBook, IBookProperties } from "../lib/types";

export default function Home() {
  let defaultProperties: IBookProperties = [
    { _id: false },
    { name: true },
    { isbn: true },
    { authors: false },
    { owned: false },
    { read: false },
    { volume: false },
    { edition: false },
    { created_at: true },
    { updated_at: false },
  ];

  const [bookState, setBooksState] = useState<IBook[]>([]);
  const [limit, setLimit] = useState(limitNumbers[0]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [properties, setProperties] = useState<IBookProperties>([
    ...defaultProperties,
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const loadData = async () => {
    const data = await fetchData(limit, page, searchTerm);
    setBooksState(data.body.books);
    setTotal(data.body.total);
  };

  useEffect(() => {
    loadData();
  }, [limit, page, properties, searchTerm]);

  return (
    <section className="flex-col">
      <h1 className="text-4xl">Books Home Page</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Paginiation
        pages={maxPages(total, limit)}
        currentPage={page}
        setPage={setPage}
      />
      <LimitSelection
        limit={limit}
        page={page}
        setLimit={setLimit}
        setPage={setPage}
        total={total}
      />
      <TogglePropertyVisibility
        properties={properties}
        setProperties={setProperties}
      />
      <BooksTable
        bookState={bookState}
        properties={properties}
        setBookState={setBooksState}
      />
      <Paginiation
        pages={maxPages(total, limit)}
        currentPage={page}
        setPage={setPage}
      />
    </section>
  );
}
