interface Book {
  name : string;
  isbn: string;
  authors: string[];
  owned: boolean;
  read: boolean;
  volume: number;
  edition: number;

  created_at: Date | string;
  updated_at: Date | string;
}

export default async function Home() {
  const data = await fetch("http://localhost:8000/books");
  const books: Book[] = await data.json();

  return (
    <>
      {books.map((item:Book) => {
        item.created_at = new Date(item.created_at)
        item.updated_at = new Date(item.updated_at)
        console.log(typeof item.created_at)
        return <div className="mt-4 mx-2 p-4 border-4">
          <h1 className="text-3xl">{item.name}</h1>
          <ul>
            {item.authors.map(author=> {
              return <li>- {author}</li>
            })}
          </ul>
          <p>{item.created_at.toString()}</p>
          <p>{item.updated_at.toString()}</p>
          </div>;
      })}
    </>
  );
}
