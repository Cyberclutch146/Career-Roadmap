from datetime import datetime
from typing import List, Optional, Dict, Any
from bson import ObjectId
from pydantic import BaseModel, Field
from database import get_database
import json


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, info=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)


class UserModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    email: str
    password: str
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class RoadmapModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: Optional[str] = None
    goal: str
    skill_level: str
    daily_hours: float
    learning_style: str
    target_months: int
    generated_roadmap: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class ProgressModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    roadmap_id: str
    lesson_id: str
    completed: bool = False
    completed_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class ChatHistoryModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    roadmap_id: str
    messages: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True


class UserRepository:
    @staticmethod
    async def create(email: str, password: str, name: str) -> str:
        db = get_database()
        user_doc = {
            "email": email,
            "password": password,
            "name": name,
            "created_at": datetime.utcnow()
        }
        result = await db.users.insert_one(user_doc)
        return str(result.inserted_id)

    @staticmethod
    async def find_by_email(email: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        user = await db.users.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user

    @staticmethod
    async def find_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])
        return user


class RoadmapRepository:
    @staticmethod
    async def create(roadmap_data: Dict[str, Any]) -> str:
        db = get_database()
        roadmap_doc = {
            **roadmap_data,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await db.roadmaps.insert_one(roadmap_doc)
        return str(result.inserted_id)

    @staticmethod
    async def find_by_id(roadmap_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        roadmap = await db.roadmaps.find_one({"_id": ObjectId(roadmap_id)})
        if roadmap:
            roadmap["_id"] = str(roadmap["_id"])
        return roadmap

    @staticmethod
    async def find_by_user(user_id: str) -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db.roadmaps.find({"user_id": user_id}).sort("created_at", -1)
        roadmaps = await cursor.to_list(length=100)
        for r in roadmaps:
            r["_id"] = str(r["_id"])
        return roadmaps

    @staticmethod
    async def update(roadmap_id: str, update_data: Dict[str, Any]) -> bool:
        db = get_database()
        update_data["updated_at"] = datetime.utcnow()
        result = await db.roadmaps.update_one(
            {"_id": ObjectId(roadmap_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0

    @staticmethod
    async def delete(roadmap_id: str) -> bool:
        db = get_database()
        result = await db.roadmaps.delete_one({"_id": ObjectId(roadmap_id)})
        return result.deleted_count > 0


class ProgressRepository:
    @staticmethod
    async def upsert(roadmap_id: str, lesson_id: str, completed: bool) -> bool:
        db = get_database()
        progress_doc = {
            "roadmap_id": roadmap_id,
            "lesson_id": lesson_id,
            "completed": completed,
            "completed_at": datetime.utcnow() if completed else None
        }
        result = await db.progress.update_one(
            {"roadmap_id": roadmap_id, "lesson_id": lesson_id},
            {"$set": progress_doc},
            upsert=True
        )
        return result.acknowledged

    @staticmethod
    async def get_by_roadmap(roadmap_id: str) -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db.progress.find({"roadmap_id": roadmap_id})
        progress = await cursor.to_list(length=1000)
        for p in progress:
            p["_id"] = str(p["_id"])
        return progress

    @staticmethod
    async def get_completed_count(roadmap_id: str) -> int:
        db = get_database()
        count = await db.progress.count_documents({
            "roadmap_id": roadmap_id,
            "completed": True
        })
        return count


class ChatHistoryRepository:
    @staticmethod
    async def create(roadmap_id: str) -> str:
        db = get_database()
        chat_doc = {
            "roadmap_id": roadmap_id,
            "messages": [],
            "created_at": datetime.utcnow()
        }
        result = await db.chat_history.insert_one(chat_doc)
        return str(result.inserted_id)

    @staticmethod
    async def get_by_roadmap(roadmap_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        chat = await db.chat_history.find_one({"roadmap_id": roadmap_id})
        if chat:
            chat["_id"] = str(chat["_id"])
        return chat

    @staticmethod
    async def add_message(roadmap_id: str, role: str, content: str) -> bool:
        db = get_database()
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat()
        }
        result = await db.chat_history.update_one(
            {"roadmap_id": roadmap_id},
            {"$push": {"messages": message}}
        )
        return result.modified_count > 0

    @staticmethod
    async def get_messages(roadmap_id: str) -> List[Dict[str, Any]]:
        chat = await ChatHistoryRepository.get_by_roadmap(roadmap_id)
        if chat:
            return chat.get("messages", [])
        return []
