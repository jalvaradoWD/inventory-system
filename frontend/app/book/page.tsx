interface IBook {
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

export default async function Home() {
  const data = await fetch("http://localhost:8000/books");
  const books: IBook[] = await data.json();

  return (
    <>
      {books.map((item: IBook) => {
        item.created_at.$date = new Date(item.created_at.$date);
        item.updated_at.$date = new Date(item.updated_at.$date);
        console.log(typeof item.created_at);
        return (
          <div className="mt-4 mx-2 p-4 border-4">
            <h1 className="text-3xl">{item.name}</h1>
            <h2>{item._id.$oid}</h2>
            <ul>
              {item.authors.map((author) => {
                return <li>- {author}</li>;
              })}
            </ul>
            <p>{item.created_at.$date.toUTCString()}</p>
            <p>{item.updated_at.$date.toUTCString()}</p>
          </div>
        );
      })}
    </>
  );
}
