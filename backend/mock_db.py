from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import re

# Sample Data
CONTACTS = [
    {
        "id": "1", "user_id": "default_user", "name": "Sarah Johnson", "phone": "+1 (555) 123-4567",
        "email": "sarah.johnson@email.com", "tags": ["VIP", "Customer"], "status": "Active",
        "lastMessage": "Thanks for the quick response!", "lastMessageTime": (datetime.now() - timedelta(hours=2)).isoformat(),
        "avatar": "SJ", "createdAt": (datetime.now() - timedelta(days=45)).isoformat()
    },
    {
        "id": "2", "user_id": "default_user", "name": "Michael Chen", "phone": "+1 (555) 234-5678",
        "email": "michael.chen@email.com", "tags": ["Lead", "Prospect"], "status": "Active",
        "lastMessage": "I'm interested in your premium plan", "lastMessageTime": (datetime.now() - timedelta(hours=5)).isoformat(),
        "avatar": "MC", "createdAt": (datetime.now() - timedelta(days=30)).isoformat()
    },
    {
        "id": "3", "user_id": "default_user", "name": "Emily Davis", "phone": "+1 (555) 345-6789",
        "email": "emily.davis@email.com", "tags": ["Customer", "Support"], "status": "Inactive",
        "lastMessage": "Got it, thank you!", "lastMessageTime": (datetime.now() - timedelta(days=1)).isoformat(),
        "avatar": "ED", "createdAt": (datetime.now() - timedelta(days=60)).isoformat()
    },
]

MESSAGES = []
# (Simplified message generation)
convs = [
    {"p": "+1 (555) 123-4567", "m": ["Hi!", "Hello Sarah!", "Interested in premium", "Great choice!", "Thanks!"]},
    {"p": "+1 (555) 234-5678", "m": ["Question about services", "What would you like to know?", "Difference in plans?"]},
]
msg_id = 1
for c in convs:
    for i, txt in enumerate(c["m"]):
        MESSAGES.append({
            "id": str(msg_id), "phoneNumber": c["p"], "text": txt,
            "timestamp": (datetime.now() - timedelta(hours=10-i)).isoformat(),
            "sent": i % 2 == 1, "status": "read", "user_id": "default_user"
        })
        msg_id += 1

CAMPAIGNS = [
    {
        "id": "1", "user_id": "default_user", "name": "Summer Sale 2024", "status": "Active",
        "description": "Promotional campaign", "recipients": 2458, "sent": 2458, "delivered": 2385,
        "read": 1917, "readRate": "78%", "deliveryRate": "97%", "createdAt": "Mar 15, 2024"
    },
    {
        "id": "2", "user_id": "default_user", "name": "Welcome Series", "status": "Active",
        "description": "Automated welcome messages", "recipients": 1234, "sent": 1234, "delivered": 1197,
        "read": 1012, "readRate": "82%", "deliveryRate": "97%", "createdAt": "Mar 10, 2024"
    }
]

TEMPLATES = [
    {
        "id": "1", "name": "Welcome Message", "category": "utility", "status": "approved", "language": "English",
        "content": "Hello {{name}}! Welcome to our service.", "parameters": ["name"], "usageCount": 1234, "createdAt": "Mar 1, 2024"
    },
    {
        "id": "2", "name": "Order Confirmation", "category": "transactional", "status": "approved", "language": "English",
        "content": "Hi {{name}}! Your order #{{order_id}} confirmed.", "parameters": ["name", "order_id"], "usageCount": 856, "createdAt": "Feb 15, 2024"
    }
]


class MockCursor:
    def __init__(self, data):
        self.data = data
        self._skip = 0
        self._limit = len(data)
        
    def sort(self, field, direction=1):
        reverse = direction == -1
        self.data.sort(key=lambda x: x.get(field, ""), reverse=reverse)
        return self

    def skip(self, n):
        self._skip = n
        return self

    def limit(self, n):
        self._limit = n
        return self

    def __iter__(self):
        return iter(self.data[self._skip : self._skip + self._limit])

    def __list__(self):
        return list(self)


class MockCollection:
    def __init__(self, name, initial_data):
        self.name = name
        self.data = initial_data

    def find(self, query=None):
        # Very basic query support
        filtered = []
        for item in self.data:
            match = True
            if query:
                for k, v in query.items():
                    if k == "$or":
                        # Simple OR support for search (name, phone, email)
                        or_match = False
                        for cond in v:
                            for sub_k, sub_v in cond.items():
                                if "$regex" in sub_v:
                                    pattern = sub_v["$regex"]
                                    if re.search(pattern, item.get(sub_k, ""), re.IGNORECASE):
                                        or_match = True
                                        break
                        if not or_match:
                            match = False
                    elif isinstance(v, dict) and "$regex" in v:
                        if not re.search(v["$regex"], item.get(k, ""), re.IGNORECASE):
                            match = False
                    elif item.get(k) != v:
                        match = False
            if match:
                filtered.append(item)
        return MockCursor(filtered)

    def find_one(self, query):
        cursor = self.find(query)
        res = list(cursor)
        return res[0] if res else None

    def insert_one(self, doc):
        if "id" not in doc:
            doc["id"] = str(len(self.data) + 1)
        self.data.append(doc)
        return type('obj', (object,), {'inserted_id': doc["id"]})

    def insert_many(self, docs):
        for doc in docs:
            self.insert_one(doc)

    def count_documents(self, query):
        return len(list(self.find(query)))

    def distinct(self, field):
        return list(set(item.get(field) for item in self.data if field in item))
        
    def delete_one(self, query):
        item = self.find_one(query)
        if item:
            self.data.remove(item)
            return type('obj', (object,), {'deleted_count': 1})
        return type('obj', (object,), {'deleted_count': 0})
    
    def update_one(self, query, update):
        item = self.find_one(query)
        if item:
            if "$set" in update:
                item.update(update["$set"])
            return type('obj', (object,), {'matched_count': 1})
        return type('obj', (object,), {'matched_count': 0})


class MockDatabaseObject:
    def __init__(self):
        self.collections = {
            "contacts": MockCollection("contacts", CONTACTS),
            "messages": MockCollection("messages", MESSAGES),
            "campaigns": MockCollection("campaigns", CAMPAIGNS),
            "templates": MockCollection("templates", TEMPLATES),
            "users": MockCollection("users", [])
        }
    
    def __getitem__(self, name):
        if name not in self.collections:
            self.collections[name] = MockCollection(name, [])
        return self.collections[name]

class MockClient:
    def __init__(self, *args, **kwargs):
        self.admin = type('obj', (object,), {'command': lambda x: print("MOCK ping")})
        self.db = MockDatabaseObject()

    def __getitem__(self, name):
        return self.db
        
    def close(self):
        pass
