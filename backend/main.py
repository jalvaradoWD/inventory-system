import datetime
import json
from contextlib import asynccontextmanager

import pymongo
from bson import ObjectId, json_util
from dotenv import dotenv_values
from fastapi import HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

from models import APIReponse, Book, MyApp

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


@app.get("/books", status_code=status.HTTP_200_OK)
def get_all_books(limit: int = 5, page: int = 0):
    """
    Makes a database request to get all books from the "books" collection from the {config["DB_NAME"]} database.

    """

    all_books = (
        app.database["books"]
        .find(
            {},
        )
        .sort("created_at", pymongo.DESCENDING)
        .limit(limit)
        .skip(limit * (page - 1))
    )

    total_amount = app.database["books"].count_documents({})

    with all_books as cursor:
        books_as_json: list[Book] = json.loads(json_util.dumps(cursor.to_list()))

        print(limit, page)

        return APIReponse(
            200,
            {"books": books_as_json, "total": total_amount},
            "Getting all Textbooks",
        )


@app.get("/books/{book_id}", status_code=status.HTTP_200_OK)
def get_specific_book(book_id: str):
    """
    Makes a databae request to get information of a spedific book from the `books` collection using the parameter `book_id`.

    :param book_id: The string format of an ObjectID to a specific document within the `books` collection
    :type book_id: str
    """
    found_book = app.database["books"].find_one({"_id": ObjectId(book_id)})
    converted_json = json.loads(json_util.dumps(found_book))
    return APIReponse(200, converted_json, "Getting specific book info.")


@app.post("/books", status_code=status.HTTP_201_CREATED)
def create_a_book(book: Book):
    """
    Creates a `Book` document based on a model.

    :param book: Uses a `Book` instance from the `models.py` file as the model for how this data is structured and validated.
    :type book: `Book`
    """
    print(book)

    created_book = app.database["books"].insert_one(book.model_dump())

    return APIReponse(
        201,
        str(created_book.inserted_id),
        f"Created book with ID of: {str(created_book.inserted_id)}",
    )


@app.put("/books/{book_id}", status_code=status.HTTP_200_OK)
def update_a_book(book_id: str, updated_book: Book):
    """
    Updates a `Book` document based on the `book_id` param, and changes the contents by the `update_book` param.

    :param book_id: The `ObjectId` to the document that will be updated.
    :type book_id: str
    :param updated_book: The contents of the new information that will be update to the found book.
    :type updated_book: Book
    """

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

    converted_json = json.loads(json_util.dumps(u_book))

    return APIReponse(200, converted_json, f"Book updated")


@app.delete("/books/{book_id}")
def delete_a_book(book_id: str):
    """
    Finds a `Book` by `ObjectId` and deletes the document on the spot.

    :param book_id: The `ObjectId` to the document that will be deleted.
    :type book_id: str
    """

    d_book = app.database["books"].find_one_and_delete({"_id": ObjectId(book_id)})

    if d_book is None:
        res_status_code = 404
        raise HTTPException(
            status_code=res_status_code,
            detail=APIReponse(
                res_status_code, message="There is no book found to delete", body=d_book
            ),
        )
    converted_json = json.loads(json_util.dumps(d_book))
    return APIReponse(200, converted_json, "Deleted Book")
