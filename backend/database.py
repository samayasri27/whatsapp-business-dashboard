from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: Optional[MongoClient] = None
    
    @classmethod
    def connect(cls):
        """Connect to MongoDB"""
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        
        try:
            # For MongoDB Atlas, we need to handle SSL properly
            cls.client = MongoClient(
                mongodb_url,
                serverSelectionTimeoutMS=5000,  # 5 second timeout
                connectTimeoutMS=5000,
                tlsAllowInvalidCertificates=True  # For development - allows self-signed certs
            )
            # Test connection
            cls.client.admin.command('ping')
            print(f"✅ Connected to MongoDB at {mongodb_url}")
        except ConnectionFailure as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            print("⚠️  Running without MongoDB - using in-memory data")
            cls.client = None
        except Exception as e:
            print(f"❌ MongoDB connection error: {e}")
            cls.client = None
    
    @classmethod
    def close(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            print("MongoDB connection closed")
    
    @classmethod
    def get_database(cls):
        """Get database instance"""
        if not cls.client:
            cls.connect()
        
        if not cls.client:
            # Return None if connection failed
            return None
        
        db_name = os.getenv("MONGODB_DB_NAME", "whatsapp_business")
        return cls.client[db_name]
    
    @classmethod
    def is_connected(cls):
        """Check if MongoDB is connected"""
        return cls.client is not None

# Database collections with error handling
def get_contacts_collection():
    db = Database.get_database()
    if db is None:
        return None
    return db["contacts"]

def get_messages_collection():
    db = Database.get_database()
    if db is None:
        return None
    return db["messages"]

def get_campaigns_collection():
    db = Database.get_database()
    if db is None:
        return None
    return db["campaigns"]

def get_templates_collection():
    db = Database.get_database()
    if db is None:
        return None
    return db["templates"]

def get_users_collection():
    db = Database.get_database()
    if db is None:
        return None
    return db["users"]

# Initialize connection on import
Database.connect()
