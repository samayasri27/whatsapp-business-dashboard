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
    customFields: Optional[dict] = {}
    notes: Optional[str] = None
    avatar: Optional[str] = None
    user_id: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: Optional[datetime] = None

class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    tags: List[str] = []
    status: str = "Active"
    customFields: Optional[dict] = {}
    notes: Optional[str] = None

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    customFields: Optional[dict] = None
    notes: Optional[str] = None

class BulkContactOperation(BaseModel):
    contactIds: List[str]
    operation: str  # "tag", "delete", "export", "update_status"
    data: Optional[dict] = None  # Additional data for the operation

class ContactImport(BaseModel):
    contacts: List[dict]
    source: Optional[str] = "manual"

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
    user_id: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: Optional[datetime] = None

class TemplateCreate(BaseModel):
    name: str
    category: str
    language: str
    content: str
    status: str = "pending"

class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    language: Optional[str] = None
    content: Optional[str] = None
    status: Optional[str] = None

class User(BaseModel):
    id: str
    username: str
    email: str
    role: str = "user"
    createdAt: datetime = Field(default_factory=datetime.now)
