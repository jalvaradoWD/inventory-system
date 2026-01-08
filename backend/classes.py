from collections.abc import Coroutine
from contextlib import AbstractAsyncContextManager
from datetime import datetime, timezone
from typing import Annotated, Any, Callable, Mapping, Sequence, Union

from fastapi import APIRouter, FastAPI, Response
from fastapi.applications import AppType
from fastapi.background import P
from fastapi.datastructures import Default
from fastapi.params import Depends
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
from fastapi.utils import generate_unique_id
from pydantic import BaseModel, ConfigDict, Field
from pymongo import MongoClient, database
from starlette.middleware import Middleware
from starlette.requests import Request
from starlette.routing import BaseRoute


class MyApp(FastAPI):
    mongo_client: MongoClient
    database: database.Database

    def __init__(
        self: AppType,
        *,
        debug: bool = False,
        routes: list[BaseRoute] | None = None,
        title: str = "FastAPI",
        summary: str | None = None,
        description: str = "",
        version: str = "0.1.0",
        openapi_url: str | None = "/openapi.json",
        openapi_tags: list[dict[str, Any]] | None = None,
        servers: list[dict[str, str | Any]] | None = None,
        dependencies: Sequence[Depends] | None = None,
        default_response_class: type[Response] = Default(JSONResponse),
        redirect_slashes: bool = True,
        docs_url: str | None = "/docs",
        redoc_url: str | None = "/redoc",
        swagger_ui_oauth2_redirect_url: str | None = "/docs/oauth2-redirect",
        swagger_ui_init_oauth: dict[str, Any] | None = None,
        middleware: Sequence[Middleware] | None = None,
        exception_handlers: (
            dict[
                int | type[Exception],
                Callable[[Request, Any], Coroutine[Any, Any, Response]],
            ]
            | None
        ) = None,
        on_startup: Sequence[Callable[[], Any]] | None = None,
        on_shutdown: Sequence[Callable[[], Any]] | None = None,
        lifespan: (
            Callable[[AppType], AbstractAsyncContextManager[None, bool | None]]
            | Callable[
                [AppType], AbstractAsyncContextManager[Mapping[str, Any], bool | None]
            ]
            | None
        ) = None,
        terms_of_service: str | None = None,
        contact: dict[str, str | Any] | None = None,
        license_info: dict[str, str | Any] | None = None,
        openapi_prefix: str = "",
        root_path: str = "",
        root_path_in_servers: bool = True,
        responses: dict[int | str, dict[str, Any]] | None = None,
        callbacks: list[BaseRoute] | None = None,
        webhooks: APIRouter | None = None,
        deprecated: bool | None = None,
        include_in_schema: bool = True,
        swagger_ui_parameters: dict[str, Any] | None = None,
        generate_unique_id_function: Callable[[APIRoute], str] = Default(
            generate_unique_id
        ),
        separate_input_output_schemas: bool = True,
        openapi_external_docs: dict[str, Any] | None = None,
        **extra: Any
    ) -> None:
        super().__init__(
            debug=debug,
            routes=routes,
            title=title,
            summary=summary,
            description=description,
            version=version,
            openapi_url=openapi_url,
            openapi_tags=openapi_tags,
            servers=servers,
            dependencies=dependencies,
            default_response_class=default_response_class,
            redirect_slashes=redirect_slashes,
            docs_url=docs_url,
            redoc_url=redoc_url,
            swagger_ui_oauth2_redirect_url=swagger_ui_oauth2_redirect_url,
            swagger_ui_init_oauth=swagger_ui_init_oauth,
            middleware=middleware,
            exception_handlers=exception_handlers,
            on_startup=on_startup,
            on_shutdown=on_shutdown,
            lifespan=lifespan,
            terms_of_service=terms_of_service,
            contact=contact,
            license_info=license_info,
            openapi_prefix=openapi_prefix,
            root_path=root_path,
            root_path_in_servers=root_path_in_servers,
            responses=responses,
            callbacks=callbacks,
            webhooks=webhooks,
            deprecated=deprecated,
            include_in_schema=include_in_schema,
            swagger_ui_parameters=swagger_ui_parameters,
            generate_unique_id_function=generate_unique_id_function,
            separate_input_output_schemas=separate_input_output_schemas,
            openapi_external_docs=openapi_external_docs,
            **extra
        )


class Book(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: Annotated[str, Field(alias="name", min_length=2)]
    isbn: Annotated[str, Field(alias="isbn", min_length=13)]
    authors: Annotated[list[str], Field(alias="authors")]
    owned: Annotated[bool, Field(alias="owned")] = False
    read: Annotated[bool, Field(alias="read")] = False
    volume: Annotated[Union[int, None], Field(alias="volume", gt=-1)] = None
    edition: Annotated[Union[int, None], Field(alias="edition", gt=-1)] = None

    created_at: Annotated[
        datetime,
        Field(default_factory=lambda x: datetime.now(timezone.utc)),
        Field(alias="created_at"),
    ]
    updated_at: Annotated[
        datetime,
        Field(default_factory=lambda x: datetime.now(timezone.utc)),
        Field(alias="updated_at"),
    ]
