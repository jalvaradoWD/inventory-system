from faker import Faker
from pymongo import MongoClient
from models import Book
from dotenv import dotenv_values

book_list: list = []

for i in range(100):
    f = Faker()
    aurthors_list: list[str] = []
    for i in range(3):
        aurthors_list.append(f"{f.first_name()} {f.last_name()}")
    new_book = Book(
        name=" ".join(f.words(nb=3)),
        isbn=f.isbn13(),
        authors=aurthors_list,
        read=f.boolean(),
        owned=f.boolean(),
        created_at=f.date_time_this_year(before_now=True),
        updated_at=f.date_time_this_year(after_now=True),
    )

    book_list.append(new_book.model_dump())


uri = dotenv_values(".env")["ATLAS_URI"]

client = MongoClient(uri)

collection = client["fastapi"].get_collection("books")

res = collection.insert_many(documents=book_list)

print(res.inserted_ids)


client.close()
