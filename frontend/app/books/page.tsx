"use client";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { deleteBook } from "../lib/Forms.Methods";
import { IAPIResponse, IBook } from "../lib/types";
import { baseUrl } from "../lib/vars";

const limitNumbers = [10, 25, 50, 100];

export default function Home(props: PageProps<"/books">) {
  const [booksState, setBooksState] = useState<IBook[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentLimit, setCurrentLimit] = useState<number>(limitNumbers[0]);
  const [totalBooks, setTotalBooks] = useState<number>(0);

  const fetchData = async (
    limit = currentLimit,
    page = currentPage,
  ) => {
    let params = await props.searchParams as { limit: string; page: string };

    let requestUrl = `${baseUrl}/books` +
      `?limit=${limit ? limit : 5}&page=${page ? page : 1}`;
    let data = await fetch(requestUrl);

    const response: IAPIResponse<{ books: IBook[]; total: number }> = await data
      .json();

    setCurrentPage(Number(params.page));
    setTotalBooks(response.body.total);
    setBooksState(response.body.books);
  };

  const highlightPageNumber = (i: number) => {
    if (i === Number(currentPage)) {
      return "  btn-active";
    }
    return "";
  };

  const renderPageNumber = (totalItems: number, limit: number) => {
    let componentList = [];
    for (let i = 0; i < Math.floor(totalItems / limit); i++) {
      let adjustedI = i + 1;

      componentList.push(
        <Link href={`/books?limit=${limit}&page=${adjustedI}`}>
          <button
            className={`btn join-item${highlightPageNumber(adjustedI)}`}
            value={adjustedI}
            onClick={() => setCurrentPage(Number(adjustedI))}
          >
            {adjustedI}
          </button>
        </Link>,
      );
    }

    componentList.unshift(<button className="btn join-item">«</button>);
    componentList.push(<button className="btn join-item">»</button>);
    return <>{componentList.map((item) => item)}</>;
  };

  useEffect(() => {
    fetchData(currentLimit, currentPage);
  }, [currentLimit, currentPage]);

  return (
    <>
      <h1 className="text-4xl">Books Home Page</h1>
      <section className="join">
        {renderPageNumber(totalBooks, currentLimit)}
      </section>
      <select
        name=""
        defaultValue={"Page Limit"}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setCurrentLimit(Number(e.target.value));
        }}
      >
        <option disabled={true}>Page Limit</option>
        {limitNumbers.map((pageNumber) => (
          <option value={pageNumber}>{pageNumber}</option>
        ))}
      </select>
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
          {booksState.map((item: IBook) => {
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
                    onClick={() => deleteBook(item, booksState, setBooksState)}
                    className="btn btn-error text-white size-fit w-full"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
