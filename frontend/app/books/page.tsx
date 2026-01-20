"use client";
import Link from "next/link";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { deleteBook } from "../lib/Forms.Methods";
import { IAPIResponse, IBook } from "../lib/types";

const limitNumbers = [10, 25, 50, 100];

let maxPages = (total: number, limit: number) => Math.floor(total / limit);

export default function Home(props: PageProps<"/books">) {
  const [bookState, setBooksState] = useState<IBook[]>([]);
  const [limit, setLimit] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [maxPage, setMaxPage] = useState(maxPages(page, limit));

  const fetchData = async () => {
    const limitQuery = limit >= 1 ? `limit=${limit}` : "";
    const pageQuery = page >= 1 ? `page=${page}` : "";
    const res = await fetch(
      `http://localhost:8000/books/?${limitQuery}&${pageQuery}`,
    );
    const data: IAPIResponse<{ books: IBook[]; total: number }> =
      await res.json();

    setBooksState(data.body.books);
    setTotal(data.body.total);
  };

  useEffect(() => {
    fetchData();
  }, [limit, page]);

  const numberChange = async (
    e: FormEvent<HTMLInputElement>,
    setFunction: Dispatch<SetStateAction<number>>,
  ) => {
    e.preventDefault();
    setFunction(Number(e.currentTarget.value));
  };

  return (
    <>
      <h1 className="text-4xl">Books Home Page</h1>
      <Paginiation
        pages={maxPages(total, limit)}
        currentPage={page}
        setPage={setPage}
      />
      <section>
        <label htmlFor="">Limit</label>
        <input
          type="number"
          name="limit"
          onChange={(e) => {
            numberChange(e, setLimit);

            if (page > maxPages(total, limit)) {
              setPage(maxPages(total, limit) + 1);
            }
          }}
          value={limit}
          min={1}
        />
      </section>
      <section>
        <label htmlFor="">Page</label>
        <input
          type="number"
          name="page"
          onChange={(e) => numberChange(e, setPage)}
          value={page}
          min={1}
          max={maxPages(total, limit) + 1}
        />
      </section>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Isbn</th>
            <th>Created At</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {bookState ? (
            bookState.map((item: IBook) => {
              return (
                <tr key={item._id.$oid}>
                  <td>{item.name}</td>
                  <td>{item.isbn}</td>
                  <td>{new Date(item.created_at.$date).toString()}</td>
                  <td>
                    <Link
                      href={`/books/update/${item._id.$oid}`}
                      className="btn btn-primary size-fit w-full"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => deleteBook(item, bookState, setBooksState)}
                      className="btn btn-error text-white size-fit w-full"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <></>
          )}
        </tbody>
      </table>
      <Paginiation
        pages={maxPages(total, limit)}
        currentPage={page}
        setPage={setPage}
      />
    </>
  );
}

function Paginiation(props: {
  pages: number;
  currentPage: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  const { pages, currentPage } = props;
  const buttons = [];

  for (let i = 0; i < pages + 1; i++) {
    let formattedNumber = i + 1;
    buttons.push(formattedNumber);
  }

  return (
    <section className="join">
      {buttons.map((item) => (
        <button
          className={`join-item btn${item === currentPage ? " btn-active" : ""}`}
          key={item}
          onClick={(e) => {
            e.preventDefault();
            props.setPage(Number(e.currentTarget.value));
          }}
          value={item}
        >
          {item}
        </button>
      ))}
    </section>
  );
}
