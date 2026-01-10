from contextlib import asynccontextmanager
import datetime
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status

from dotenv import dotenv_values
from pymongo import MongoClient
from bson import ObjectId, json_util
import json
import pymongo

from models import Book, MyApp


origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]


@asynccontextmanager
async def lifespan(app: MyApp):
    app.mongo_client = MongoClient(config["ATLAS_URI"])
    if config["DB_NAME"] is not None:
        app.database = app.mongo_client[config["DB_NAME"]]
    yield
    app.mongo_client.close()


app = MyApp(lifespan=lifespan)
config = dotenv_values(".env")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def index():
    return {"message": "Index Route"}


@app.get("/books", status_code=status.HTTP_200_OK)
def get_all_books():
    all_books = (
        app.database["books"]
        .find(
            {},
        )
        .sort("created_at", pymongo.DESCENDING)
    )
    with all_books as cursor:
        books_as_json: list[Book] = json.loads(json_util.dumps(cursor.to_list()))
        print(type(books_as_json[0]))
        # print(books_as_json[0]["_id"]["$oid"])
        return books_as_json


@app.get("/books/{book_id}", status_code=status.HTTP_200_OK)
def get_specific_book(book_id: str):
    found_book = app.database["books"].find_one({"_id": ObjectId(book_id)})
    return json.loads(json_util.dumps(found_book))


@app.post("/books", status_code=status.HTTP_201_CREATED)
def create_a_book(book: Book):
    created_book = app.database["books"].insert_one(book.model_dump())
    response = {"message": "", "document": {}}
    response_obj = {"_id": None, **book.model_dump()}
    response_obj["_id"] = created_book.inserted_id
    response["document"] = response_obj
    return json.loads(json_util.dumps(response))


@app.put("/books/{book_id}", status_code=status.HTTP_200_OK)
def update_a_book(book_id: str, updated_book: Book):
    u_book = app.database["books"].find_one_and_update(
        {"_id": ObjectId(book_id)},
        {
            "$set": {
                "name": updated_book.name,
                "isbn": updated_book.isbn,
                "authors": updated_book.authors,
                "read": updated_book.read,
                "owned": updated_book.owned,
                "edition": updated_book.edition,
                "volume": updated_book.volume,
                "updated_at": datetime.datetime.now(datetime.timezone.utc),
            }
        },
        return_document=True,
    )

    return json.loads(json_util.dumps(u_book))


@app.delete("/books/{book_id}")
def delete_a_book(book_id: str):
    d_book = app.database["books"].find_one_and_delete({"_id": ObjectId(book_id)})
    print(d_book)
    if d_book is None:
        return {"message": "There is no book found to delete."}
    return {
        "message": f"Book {d_book["name"]}, deleted!",
        "document": json.loads(json_util.dumps(d_book)),
    }
