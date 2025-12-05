from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Contact(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    tags: List[str] = []
    status: str = "Active"
    lastMessage: Optional[str] = None
    lastMessageTime: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.now)

class Message(BaseModel):
    id: str
    phoneNumber: str
    text: str
    timestamp: datetime = Field(default_factory=datetime.now)
    sent: bool
    status: Optional[str] = "sent"
    mediaUrl: Optional[str] = None
    mediaType: Optional[str] = None

class SendMessageRequest(BaseModel):
    phone: str
    message: str
    template: Optional[dict] = None

class Campaign(BaseModel):
    id: str
    name: str
    status: str
    description: str
    recipients: int
    sent: int = 0
    delivered: int = 0
    read: int = 0
    readRate: str = "0%"
    deliveryRate: str = "0%"
    createdAt: datetime = Field(default_factory=datetime.now)
    scheduledAt: Optional[datetime] = None

class Template(BaseModel):
    id: str
    name: str
    category: str
    status: str
    language: str
    content: str
    parameters: List[str] = []
    usageCount: int = 0
    createdAt: datetime = Field(default_factory=datetime.now)

class User(BaseModel):
    id: str
    username: str
    email: str
    role: str = "user"
    createdAt: datetime = Field(default_factory=datetime.now)
