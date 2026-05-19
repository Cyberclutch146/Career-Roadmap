from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from bson import ObjectId
from database import get_database


# ---------------------------------------------------------------------------
# Repository: Users
# (Users are still looked up by MongoDB ObjectId _id, which is correct
#  because the token stores the ObjectId string from insert_one.)
# ---------------------------------------------------------------------------

class UserRepository:
    @staticmethod
    async def create(email: str, password: str, name: str) -> str:
        db = get_database()
        user_doc = {
            "email": email,
            "password": password,
            "name": name,
            "created_at": datetime.now(timezone.utc)
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
        try:
            user = await db.users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            return None
        if user:
            user["_id"] = str(user["_id"])
        return user


# ---------------------------------------------------------------------------
# Repository: Roadmaps
# Roadmaps use a UUID "id" field as the public identifier.
# All lookups query on {"id": roadmap_id}, NOT {"_id": ObjectId(...)}.
# ---------------------------------------------------------------------------

class RoadmapRepository:
    @staticmethod
    async def create(roadmap_data: Dict[str, Any]) -> str:
        db = get_database()
        # Timestamps should already be set by main.py; set as fallback here.
        now = datetime.now(timezone.utc)
        roadmap_doc = {
            **roadmap_data,
            "created_at": roadmap_data.get("created_at", now),
            "updated_at": roadmap_data.get("updated_at", now),
        }
        result = await db.roadmaps.insert_one(roadmap_doc)
        return str(result.inserted_id)

    @staticmethod
    async def find_by_id(roadmap_id: str) -> Optional[Dict[str, Any]]:
        """Find a roadmap by its UUID string 'id' field."""
        db = get_database()
        roadmap = await db.roadmaps.find_one({"id": roadmap_id})
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
        update_data["updated_at"] = datetime.now(timezone.utc)
        result = await db.roadmaps.update_one(
            {"id": roadmap_id},
            {"$set": update_data}
        )
        return result.modified_count > 0

    @staticmethod
    async def delete(roadmap_id: str) -> bool:
        db = get_database()
        result = await db.roadmaps.delete_one({"id": roadmap_id})
        return result.deleted_count > 0


# ---------------------------------------------------------------------------
# Repository: Progress
# ---------------------------------------------------------------------------

class ProgressRepository:
    @staticmethod
    async def upsert(roadmap_id: str, lesson_id: str, completed: bool) -> bool:
        db = get_database()
        progress_doc = {
            "roadmap_id": roadmap_id,
            "lesson_id": lesson_id,
            "completed": completed,
            "completed_at": datetime.now(timezone.utc) if completed else None
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


# ---------------------------------------------------------------------------
# Repository: Chat History
# Uses upsert=True so the document is created on the first message.
# ---------------------------------------------------------------------------

class ChatHistoryRepository:
    @staticmethod
    async def add_message(roadmap_id: str, role: str, content: str) -> bool:
        db = get_database()
        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        result = await db.chat_history.update_one(
            {"roadmap_id": roadmap_id},
            {
                "$push": {"messages": message},
                "$setOnInsert": {
                    "roadmap_id": roadmap_id,
                    "created_at": datetime.now(timezone.utc)
                }
            },
            upsert=True
        )
        return result.acknowledged

    @staticmethod
    async def get_by_roadmap(roadmap_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        chat = await db.chat_history.find_one({"roadmap_id": roadmap_id})
        if chat:
            chat["_id"] = str(chat["_id"])
        return chat

    @staticmethod
    async def get_messages(roadmap_id: str) -> List[Dict[str, Any]]:
        chat = await ChatHistoryRepository.get_by_roadmap(roadmap_id)
        if chat:
            return chat.get("messages", [])
        return []
