import datetime
from typing import Literal

from bson import ObjectId


class HTTP_API_Response_Body:
    _id: dict[Literal["$oid"], str] = {"$oid": str(ObjectId())}
    name: str
    isbn: str
    authors: list[str] = []
    owned: bool
    read: bool
    volume: int
    edition: int
    created_at: dict[Literal["$date"], str] = {"$date": str(datetime.datetime.now())}
    updated_at: dict[Literal["$date"], str] = {"$date": str(datetime.datetime.now())}

    def __init__(
        self,
        name: str,
        isbn: str,
        authors: list[str],
        owned: bool,
        read: bool,
        volume: int,
        edition: int,
    ) -> None:
        self.name = name
        self.isbn = isbn
        self.authors = authors
        self.owned = owned
        self.read = read
        self.volume = volume
        self.edition = edition


class HTTP_API_Response:
    status_code: int
    body: HTTP_API_Response_Body
    message: str

    def __init__(
        self, status_code: int, body: HTTP_API_Response_Body, message: str
    ) -> None:
        self.status_code = status_code
        self.body = body
        self.message = message
