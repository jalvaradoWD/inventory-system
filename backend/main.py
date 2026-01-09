from contextlib import asynccontextmanager
import datetime
from fastapi.middleware.cors import CORSMiddleware

from dotenv import dotenv_values
from pymongo import MongoClient
from bson import ObjectId, json_util
import json
import pymongo

from classes import Book, MyApp


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


@app.get("/books")
def get_all_books():
    all_books = (
        app.database["books"]
        .find(
            {},
        )
        .sort("created_at", pymongo.DESCENDING)
    )
    with all_books as cursor:
        books_as_json = json.loads(json_util.dumps(cursor.to_list()))

        return books_as_json


@app.get("/books/{book_id}")
def get_specific_book(book_id: str):
    found_book = app.database["books"].find_one({"_id": ObjectId(book_id)})
    return json.loads(json_util.dumps(found_book))


@app.post("/books")
def create_a_book(book: Book):
    created_book = app.database["books"].insert_one(book.model_dump())
    return json.loads(json_util.dumps(created_book))


@app.put("/books/{book_id}")
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
