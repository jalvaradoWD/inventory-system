from contextlib import asynccontextmanager
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
    print(book)
    created_book = app.database["books"].insert_one(book.model_dump())
    print(created_book)
    return f"Book '{book.name}' has been created."


@app.put("/books/{book_id}")
def update_a_book(book_id: str, updated_book: Book):
    found_book = app.database["books"].find_one({"_id": ObjectId(book_id)})
    print(found_book)
    print(book_id)
    return "Hello world"
