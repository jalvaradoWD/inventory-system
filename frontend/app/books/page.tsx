"use client";
import Link from "next/link";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { deleteBook } from "../lib/Forms.Methods";
import { Book, IAPIResponse, IBook } from "../lib/types";

const limitNumbers = [10, 25, 50, 100];

let maxPages = (total: number, limit: number) => Math.floor(total / limit);

export default function Home() {
  let defaultProperties: { [name: string]: boolean }[] = [
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
  const [properties, setProperties] = useState<{ [name: string]: boolean }[]>([
    ...defaultProperties,
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchData = async () => {
    const limitQuery = limit >= 1 ? `limit=${limit}` : "";
    const pageQuery = page >= 1 ? `page=${page}` : "";
    const searchQuery = searchTerm.length >= 1 ? `search=${searchTerm}` : "";
    const res = await fetch(
      `http://localhost:8000/books/?${limitQuery}&${pageQuery}&${searchQuery}`,
    );
    const data: IAPIResponse<{ books: IBook[]; total: number }> =
      await res.json();

    setBooksState(data.body.books);
    setTotal(data.body.total);
  };

  useEffect(() => {
    fetchData();
  }, [limit, page, properties, searchTerm]);

  const limitNumberChange = async (
    e: FormEvent<HTMLInputElement | HTMLSelectElement>,
    setFunction: Dispatch<SetStateAction<number>>,
  ) => {
    e.preventDefault();
    setFunction(Number(e.currentTarget.value));
  };

  return (
    <section className="flex-col">
      <h1 className="text-4xl">Books Home Page</h1>
      <label className="input">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          required
          placeholder="Search"
          onChange={(e: FormEvent<HTMLInputElement>) => {
            e.preventDefault();
            const currVal: string = e.currentTarget.value;
            setSearchTerm(currVal);
          }}
          value={searchTerm}
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Something");
          }}
        />
      </label>
      <Paginiation
        pages={maxPages(total, limit)}
        currentPage={page}
        setPage={setPage}
      />
      <section>
        <label htmlFor="">Limit</label>
        <select
          name=""
          id=""
          className="select"
          onChange={(e: FormEvent<HTMLSelectElement>) => {
            limitNumberChange(e, setLimit);
            if (page > maxPages(total, limit)) {
              setPage(maxPages(total, limit) + 1);
            }
          }}
        >
          <option disabled={true} value="">
            Pick a Limit
          </option>

          {limitNumbers.map((item) => {
            return (
              <option key={`limit-${item}`} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </section>
      <div className="dropdown dropdown-right">
        <div tabIndex={0} role="button" className="btn btn-ghost rounded-field">
          Properties
        </div>
        <ul
          tabIndex={-1}
          className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
        >
          {properties.map((item, i) => {
            const itemName: string = Object.keys(item)[0];

            return (
              <li key={`property-${item}-${i}`} className="flex-row">
                <label
                  htmlFor={`${itemName}-checkbox`}
                  className="text-left mr-auto"
                >
                  {itemName}
                </label>
                <input
                  id={`${itemName}-checkbox`}
                  type="checkbox"
                  className="checkbox"
                  checked={
                    properties.filter(
                      (property) => Object.keys(property)[0] === itemName,
                    )[0][itemName]
                  }
                  onChange={(e: FormEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    const currentValue = Boolean(e.currentTarget.checked);

                    setProperties([
                      ...properties.map((property) => {
                        if (Object.keys(property)[0] === itemName) {
                          return { [itemName]: currentValue };
                        }

                        return property;
                      }),
                    ]);
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <table className="table">
        <thead>
          <tr>
            {properties
              .filter((item) => {
                return item[Object.keys(item)[0]];
              })
              .map((item, i) => {
                return (
                  <th key={`property-${item}-${i}`}>{Object.keys(item)[0]}</th>
                );
              })}
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {bookState ? (
            bookState.map((book: IBook) => {
              return (
                <tr key={book._id.$oid}>
                  {properties
                    .filter((property) => {
                      let itemName = Object.keys(property)[0];
                      if (property[itemName]) {
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((property) => {
                      const itemName = Object.keys(property)[0];

                      const formattedBook = new Book().convertIBook(book);

                      return (
                        <td key={`property-${itemName}-view`}>
                          {formattedBook[itemName]}
                        </td>
                      );
                    })}

                  <td>
                    <Link
                      href={`/books/update/${book._id.$oid}`}
                      className="btn btn-primary size-fit w-full"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => deleteBook(book, bookState, setBooksState)}
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
    </section>
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
    <section className="join block">
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
