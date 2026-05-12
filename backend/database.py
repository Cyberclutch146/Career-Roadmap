from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.database import Database
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "roadmapai")


class DatabaseConnection:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[Database] = None

    @classmethod
    async def connect(cls):
        cls.client = AsyncIOMotorClient(MONGODB_URI)
        cls.db = cls.client[DATABASE_NAME]
        await cls.create_indexes()

    @classmethod
    async def disconnect(cls):
        if cls.client:
            cls.client.close()

    @classmethod
    async def create_indexes(cls):
        if cls.db is not None:
            await cls.db.users.create_index("email", unique=True)
            await cls.db.roadmaps.create_index("user_id")
            await cls.db.roadmaps.create_index("created_at")
            await cls.db.progress.create_index([("roadmap_id", 1), ("lesson_id", 1)], unique=True)
            await cls.db.chat_history.create_index("roadmap_id")

    @classmethod
    def get_db(cls) -> Database:
        if cls.db is None:
            raise RuntimeError("Database not connected")
        return cls.db


def get_database() -> Database:
    return DatabaseConnection.get_db()
