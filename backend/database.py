from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from typing import Optional
import os
from dotenv import load_dotenv
import certifi

load_dotenv()

class Database:
    client: Optional[MongoClient] = None
    
    @classmethod
    def connect(cls):
        """Connect to MongoDB"""
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        
        try:
            # Use certifi for proper SSL certificate verification on macOS
            cls.client = MongoClient(
                mongodb_url,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                tls=True,
                tlsCAFile=certifi.where(),
                uuidRepresentation='standard'
            )
            
            # Verify connection
            cls.client.admin.command('ping')
            print(f"✅ Connected to MongoDB")
            
        except Exception as e:
            print(f"⚠️  MongoDB connection failed: {e}")
            print(f"⚠️  Switching to MOCK DATABASE (In-Memory)")
            
            from mock_db import MockClient
            cls.client = MockClient()
    
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
        
        # NOTE: cls.client might be MockClient, which behaves like MongoClient
        
        db_name = os.getenv("MONGODB_DB_NAME", "whatsapp_business")
        return cls.client[db_name]
    
    @classmethod
    def is_connected(cls):
        """Check if MongoDB is connected"""
        return cls.client is not None

# Collection accessors
def get_collection(name: str):
    db = Database.get_database()
    return db[name] if db is not None else None

def get_contacts_collection(): return get_collection("contacts")
def get_messages_collection(): return get_collection("messages")
def get_campaigns_collection(): return get_collection("campaigns")
def get_templates_collection(): return get_collection("templates")
def get_users_collection(): return get_collection("users")
def get_agent_logs_collection(): return get_collection("agent_logs")
def get_agents_collection(): return get_collection("agents")

# Initialize connection on import
Database.connect()
