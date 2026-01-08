from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from dotenv import dotenv_values
from pymongo import MongoClient
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
        .find({}, projection={"_id": False})
        .sort("created_at", pymongo.DESCENDING)
    )
    with all_books as cursor:
        return cursor.to_list()

    return ""


@app.post("/books")
def create_a_book(book: Book):
    print(book)
    created_book = app.database["books"].insert_one(book.model_dump())
    print(created_book)
    return f"Book '{book.name}' has been created."
