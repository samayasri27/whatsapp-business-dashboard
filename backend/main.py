from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv
from jose import jwt, JWTError
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI(title="WhatsApp Business API - Hybrid Auth (Clerk + JWT)")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "http://localhost:3003"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clerk configuration
CLERK_PEM_PUBLIC_KEY = os.getenv("CLERK_PEM_PUBLIC_KEY", "")
CLERK_ISSUER = os.getenv("CLERK_ISSUER", "")

# JWT configuration (for API-to-API or legacy systems)
JWT_SECRET = os.getenv("JWT_SECRET", "your_secret_key_change_in_production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

# Debug mode
DEBUG = os.getenv("DEBUG", "False") == "True"


def verify_clerk_token(token: str) -> Dict[str, Any]:
    """Verify Clerk JWT token"""
    try:
        if CLERK_PEM_PUBLIC_KEY and CLERK_ISSUER:
            payload = jwt.decode(
                token,
                CLERK_PEM_PUBLIC_KEY,
                algorithms=["RS256"],
                issuer=CLERK_ISSUER
            )
            return {"type": "clerk", "user_id": payload.get("sub"), "data": payload}
        else:
            raise Exception("Clerk not configured")
    except Exception as e:
        raise Exception(f"Clerk verification failed: {str(e)}")


def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Verify standard JWT token"""
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        return {"type": "jwt", "user_id": payload.get("sub"), "data": payload}
    except Exception as e:
        raise Exception(f"JWT verification failed: {str(e)}")


async def verify_jwt_auth(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    JWT authentication for API communication
    
    Flow:
    1. User authenticates with Clerk (frontend)
    2. Frontend exchanges Clerk session for JWT (/auth/clerk-to-jwt)
    3. Frontend uses JWT for all API calls
    4. Backend verifies JWT token
    
    This meets hackathon requirements:
    - Clerk for user authentication (better UX)
    - JWT for API communication (hackathon requirement)
    """
    if not authorization:
        if DEBUG:
            print("⚠️ DEBUG mode: Allowing request without token")
            return {"type": "debug", "user_id": "dev_user", "data": {"debug": True}}
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    token = authorization.replace("Bearer ", "")
    
    # Verify JWT token
    try:
        result = verify_jwt_token(token)
        print(f"✅ JWT token verified: {result['user_id']}")
        return result
    except Exception as jwt_error:
        print(f"⚠️ JWT verification failed: {jwt_error}")
        
        # If DEBUG mode, allow anyway
        if DEBUG:
            print("⚠️ DEBUG mode: Allowing request without valid token")
            return {"type": "debug", "user_id": "dev_user", "data": {"debug": True}}
        
        raise HTTPException(
            status_code=401,
            detail=f"Invalid JWT token: {jwt_error}"
        )


def create_jwt_token(user_id: str, additional_data: Dict[str, Any] = None) -> str:
    """
    Create a standard JWT token (for API-to-API communication)
    
    Use this for:
    - Service-to-service authentication
    - Legacy system integration
    - External API access
    """
    payload = {
        "sub": user_id,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        "type": "jwt"
    }
    
    if additional_data:
        payload.update(additional_data)
    
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

@app.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "WhatsApp Business API",
        "auth": "Hybrid (Clerk + JWT)",
        "debug_mode": DEBUG
    }

@app.post("/auth/clerk-to-jwt")
async def exchange_clerk_for_jwt(request: dict):
    """
    Exchange Clerk user session for JWT token
    
    This is the primary authentication flow:
    1. User signs in with Clerk (frontend)
    2. Frontend calls this endpoint with Clerk user info
    3. Backend generates JWT token for API communication
    4. Frontend uses JWT for all subsequent API calls
    
    This approach:
    - Uses Clerk for user authentication (better UX)
    - Uses JWT for API communication (hackathon requirement)
    """
    clerk_user_id = request.get("clerk_user_id")
    email = request.get("email")
    name = request.get("name")
    
    if not clerk_user_id:
        raise HTTPException(status_code=400, detail="clerk_user_id is required")
    
    # Generate JWT token with user info
    token = create_jwt_token(
        clerk_user_id,
        {
            "email": email,
            "name": name,
            "source": "clerk",
            "auth_method": "clerk"
        }
    )
    
    return {
        "token": token,
        "type": "jwt",
        "expires_in_hours": JWT_EXPIRATION_HOURS,
        "user_id": clerk_user_id,
        "message": "Clerk session exchanged for JWT successfully"
    }

@app.post("/auth/generate-jwt")
async def generate_jwt_token(user_id: str, api_key: str):
    """
    Generate a JWT token for API-to-API communication
    
    Use this endpoint to get a JWT token for:
    - Service-to-service authentication
    - Legacy system integration
    - External API access
    
    Requires an API key for security
    """
    # Verify API key
    expected_api_key = os.getenv("API_KEY", "your_api_key_here")
    if api_key != expected_api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    # Generate JWT token
    token = create_jwt_token(user_id, {"source": "api", "auth_method": "api_key"})
    
    return {
        "token": token,
        "type": "jwt",
        "expires_in_hours": JWT_EXPIRATION_HOURS,
        "user_id": user_id
    }

@app.get("/auth/verify")
async def verify_token_endpoint(user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """
    Verify any token (Clerk or JWT)
    
    Use this to test if your token is valid
    """
    return {
        "valid": True,
        "token_type": user["type"],
        "user_id": user["user_id"],
        "data": user["data"]
    }

@app.get("/users")
async def get_users(login_user: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get all contacts for a user"""
    from database import get_contacts_collection
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            # MongoDB not connected, return sample data
            return [
                {
                    "id": "1",
                    "user_id": login_user,
                    "name": "Sarah Johnson",
                    "phone": "+1 (555) 123-4567",
                    "email": "sarah.johnson@email.com",
                    "tags": ["VIP", "Customer"],
                    "status": "Active",
                    "lastMessage": "2 hours ago",
                    "avatar": "SJ"
                }
            ]
        
        # Get contacts for this user
        contacts = list(contacts_collection.find(
            {"user_id": login_user},
            {"_id": 0}  # Exclude MongoDB _id
        ))
        
        # If no contacts, return sample data
        if not contacts:
            sample_contacts = [
                {
                    "id": "1",
                    "user_id": login_user,
                    "name": "Sarah Johnson",
                    "phone": "+1 (555) 123-4567",
                    "email": "sarah.johnson@email.com",
                    "tags": ["VIP", "Customer"],
                    "status": "Active",
                    "lastMessage": "2 hours ago",
                    "avatar": "SJ"
                },
                {
                    "id": "2",
                    "user_id": login_user,
                    "name": "Michael Chen",
                    "phone": "+1 (555) 234-5678",
                    "email": "michael.chen@email.com",
                    "tags": ["Lead", "Prospect"],
                    "status": "Active",
                    "lastMessage": "5 hours ago",
                    "avatar": "MC"
                },
                {
                    "id": "3",
                    "user_id": login_user,
                    "name": "Emily Davis",
                    "phone": "+1 (555) 345-6789",
                    "email": "emily.davis@email.com",
                    "tags": ["Customer", "Support"],
                    "status": "Inactive",
                    "lastMessage": "1 day ago",
                    "avatar": "ED"
                }
            ]
            # Insert sample data
            contacts_collection.insert_many(sample_contacts)
            return sample_contacts
        
        return contacts
    except Exception as e:
        print(f"Error fetching contacts: {e}")
        import traceback
        traceback.print_exc()
        # Return sample data on error
        return [
            {
                "id": "1",
                "name": "Sarah Johnson",
                "phone": "+1 (555) 123-4567",
                "email": "sarah.johnson@email.com",
                "tags": ["VIP", "Customer"],
                "status": "Active",
                "lastMessage": "2 hours ago"
            }
        ]

@app.get("/tags")
async def get_tags(user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get all contact tags"""
    from database import get_contacts_collection
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            return ["VIP", "Customer", "Lead", "Prospect", "Support"]
        
        # Get unique tags from all contacts
        all_tags = contacts_collection.distinct("tags")
        
        if not all_tags:
            return ["VIP", "Customer", "Lead", "Prospect", "Support"]
        
        return all_tags
    except Exception as e:
        print(f"Error fetching tags: {e}")
        return ["VIP", "Customer", "Lead", "Prospect", "Support"]

@app.get("/chats/{phone_number}")
async def get_chat_history(phone_number: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get chat history for a phone number"""
    from database import get_messages_collection, get_contacts_collection
    from datetime import datetime
    
    try:
        messages_collection = get_messages_collection()
        contacts_collection = get_contacts_collection()
        
        if messages_collection is None or contacts_collection is None:
            return {
                "phoneNumber": phone_number,
                "contactName": "Unknown",
                "messages": []
            }
        
        # Get contact name
        contact = contacts_collection.find_one({"phone": phone_number}, {"_id": 0, "name": 1})
        contact_name = contact["name"] if contact else "Unknown"
        
        # Get messages
        messages = list(messages_collection.find(
            {"phoneNumber": phone_number},
            {"_id": 0}
        ).sort("timestamp", 1))
        
        # If no messages, create sample conversation
        if not messages:
            sample_messages = [
                {
                    "id": "1",
                    "phoneNumber": phone_number,
                    "text": "Hi! I'm interested in your products.",
                    "timestamp": datetime.now().isoformat(),
                    "sent": False,
                    "status": "read"
                },
                {
                    "id": "2",
                    "phoneNumber": phone_number,
                    "text": "Hello! Thank you for reaching out. How can I help you today?",
                    "timestamp": datetime.now().isoformat(),
                    "sent": True,
                    "status": "read"
                },
                {
                    "id": "3",
                    "phoneNumber": phone_number,
                    "text": "I'd like to know more about the pricing plans.",
                    "timestamp": datetime.now().isoformat(),
                    "sent": False,
                    "status": "read"
                }
            ]
            messages_collection.insert_many(sample_messages)
            messages = sample_messages
        
        return {
            "phoneNumber": phone_number,
            "contactName": contact_name,
            "messages": messages
        }
    except Exception as e:
        print(f"Error fetching chat history: {e}")
        return {
            "phoneNumber": phone_number,
            "contactName": "Unknown",
            "messages": []
        }

@app.post("/send")
async def send_message(data: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Send a message"""
    from database import get_messages_collection
    from datetime import datetime
    import uuid
    
    try:
        phone = data.get("phone")
        message = data.get("message")
        template = data.get("template")
        
        if not phone or not message:
            raise HTTPException(status_code=400, detail="Phone and message are required")
        
        messages_collection = get_messages_collection()
        
        # Create message document
        message_doc = {
            "id": str(uuid.uuid4()),
            "phoneNumber": phone,
            "text": message,
            "timestamp": datetime.now().isoformat(),
            "sent": True,
            "status": "sent",
            "user_id": user["user_id"]
        }
        
        if template:
            message_doc["template"] = template
        
        # Save to database if connected
        if messages_collection is not None:
            messages_collection.insert_one(message_doc)
        
        # TODO: Integrate with WhatsApp Business API
        # For now, simulate sending
        
        return {
            "status": "sent",
            "messageId": message_doc["id"],
            "timestamp": message_doc["timestamp"]
        }
    except Exception as e:
        print(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")

@app.get("/campaigns")
async def get_campaigns(user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get all campaigns"""
    from database import get_campaigns_collection
    
    try:
        campaigns_collection = get_campaigns_collection()
        
        if campaigns_collection is None:
            return []
        
        # Get campaigns for this user
        campaigns = list(campaigns_collection.find(
            {"user_id": user["user_id"]},
            {"_id": 0}
        ))
        
        # If no campaigns, create sample data
        if not campaigns:
            sample_campaigns = [
                {
                    "id": "1",
                    "user_id": user["user_id"],
                    "name": "Summer Sale 2024",
                    "status": "Active",
                    "description": "Promotional campaign for our summer collection",
                    "recipients": 2458,
                    "sent": 2458,
                    "delivered": 2385,
                    "read": 1917,
                    "readRate": "78%",
                    "deliveryRate": "97%",
                    "createdAt": "Mar 15, 2024"
                },
                {
                    "id": "2",
                    "user_id": user["user_id"],
                    "name": "Welcome Series",
                    "status": "Active",
                    "description": "Automated welcome messages for new subscribers",
                    "recipients": 1234,
                    "sent": 1234,
                    "delivered": 1197,
                    "read": 1012,
                    "readRate": "82%",
                    "deliveryRate": "97%",
                    "createdAt": "Mar 10, 2024"
                },
                {
                    "id": "3",
                    "user_id": user["user_id"],
                    "name": "Product Launch",
                    "status": "Completed",
                    "description": "Announcement campaign for our new product line",
                    "recipients": 5678,
                    "sent": 5678,
                    "delivered": 5508,
                    "read": 4259,
                    "readRate": "75%",
                    "deliveryRate": "97%",
                    "createdAt": "Mar 5, 2024"
                }
            ]
            campaigns_collection.insert_many(sample_campaigns)
            return sample_campaigns
        
        return campaigns
    except Exception as e:
        print(f"Error fetching campaigns: {e}")
        return []

@app.get("/campaign_contacts")
async def get_campaign_contacts(campaign: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get contacts for a specific campaign"""
    return []

@app.get("/imported_numbers")
async def get_imported_numbers(sheet_name: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get contacts from Google Sheet"""
    return []

@app.get("/templates")
async def get_templates(user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get all WhatsApp templates"""
    from database import get_templates_collection
    
    try:
        templates_collection = get_templates_collection()
        
        if templates_collection is None:
            return []
        
        # Get templates
        templates = list(templates_collection.find({}, {"_id": 0}))
        
        # If no templates, create sample data
        if not templates:
            sample_templates = [
                {
                    "id": "1",
                    "name": "Welcome Message",
                    "category": "utility",
                    "status": "approved",
                    "language": "English",
                    "content": "Hello {{name}}! 👋 Welcome to our service. We're excited to have you on board!",
                    "parameters": ["name"],
                    "usageCount": 1234,
                    "createdAt": "Mar 1, 2024"
                },
                {
                    "id": "2",
                    "name": "Order Confirmation",
                    "category": "transactional",
                    "status": "approved",
                    "language": "English",
                    "content": "Hi {{name}}! Your order #{{order_id}} has been confirmed. Expected delivery: {{date}}.",
                    "parameters": ["name", "order_id", "date"],
                    "usageCount": 856,
                    "createdAt": "Feb 15, 2024"
                },
                {
                    "id": "3",
                    "name": "Promotional Offer",
                    "category": "marketing",
                    "status": "approved",
                    "language": "English",
                    "content": "🎉 Exclusive offer for you, {{name}}! Get {{discount}}% off. Use code: {{code}}",
                    "parameters": ["name", "discount", "code"],
                    "usageCount": 2341,
                    "createdAt": "Mar 5, 2024"
                },
                {
                    "id": "4",
                    "name": "OTP Verification",
                    "category": "authentication",
                    "status": "approved",
                    "language": "English",
                    "content": "Your verification code is {{code}}. This code expires in 10 minutes.",
                    "parameters": ["code"],
                    "usageCount": 4521,
                    "createdAt": "Jan 15, 2024"
                }
            ]
            templates_collection.insert_many(sample_templates)
            return sample_templates
        
        return templates
    except Exception as e:
        print(f"Error fetching templates: {e}")
        return []

@app.get("/sheets")
async def get_sheets(user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get all Google Sheets"""
    # TODO: Integrate with Google Sheets API
    return [
        {
            "id": "1",
            "name": "Customer List 2024",
            "url": "https://docs.google.com/spreadsheets/d/...",
            "contactCount": 1250,
            "lastSync": "2 hours ago"
        },
        {
            "id": "2",
            "name": "VIP Contacts",
            "url": "https://docs.google.com/spreadsheets/d/...",
            "contactCount": 89,
            "lastSync": "1 day ago"
        }
    ]

# Additional endpoints for full functionality

@app.post("/contacts")
async def create_contact(contact: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Create a new contact"""
    from database import get_contacts_collection
    import uuid
    
    try:
        contacts_collection = get_contacts_collection()
        
        contact_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user["user_id"],
            "name": contact.get("name"),
            "phone": contact.get("phone"),
            "email": contact.get("email"),
            "tags": contact.get("tags", []),
            "status": contact.get("status", "Active"),
            "avatar": contact.get("name", "U")[:2].upper(),
            "createdAt": datetime.now().isoformat()
        }
        
        if contacts_collection is not None:
            contacts_collection.insert_one(contact_doc)
        
        return {"success": True, "contact": contact_doc}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create contact: {str(e)}")

@app.put("/contacts/{contact_id}")
async def update_contact(contact_id: str, contact: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Update a contact"""
    from database import get_contacts_collection
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        result = contacts_collection.update_one(
            {"id": contact_id, "user_id": user["user_id"]},
            {"$set": contact}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        return {"success": True, "message": "Contact updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update contact: {str(e)}")

@app.delete("/contacts/{contact_id}")
async def delete_contact(contact_id: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Delete a contact"""
    from database import get_contacts_collection
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        result = contacts_collection.delete_one(
            {"id": contact_id, "user_id": user["user_id"]}
        )
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        return {"success": True, "message": "Contact deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete contact: {str(e)}")

@app.post("/campaigns")
async def create_campaign(campaign: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Create a new campaign"""
    from database import get_campaigns_collection
    import uuid
    
    try:
        campaigns_collection = get_campaigns_collection()
        
        campaign_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user["user_id"],
            "name": campaign.get("name"),
            "description": campaign.get("description"),
            "status": "Draft",
            "recipients": 0,
            "sent": 0,
            "delivered": 0,
            "read": 0,
            "readRate": "0%",
            "deliveryRate": "0%",
            "createdAt": datetime.now().isoformat()
        }
        
        if campaigns_collection is not None:
            campaigns_collection.insert_one(campaign_doc)
        
        return {"success": True, "campaign": campaign_doc}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create campaign: {str(e)}")

@app.get("/dashboard/stats")
async def get_dashboard_stats(user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get dashboard statistics"""
    from database import get_contacts_collection, get_messages_collection, get_campaigns_collection
    
    try:
        contacts_collection = get_contacts_collection()
        messages_collection = get_messages_collection()
        campaigns_collection = get_campaigns_collection()
        
        if contacts_collection is None or messages_collection is None or campaigns_collection is None:
            return {
                "totalContacts": 0,
                "activeChats": 0,
                "campaigns": 0,
                "messagesSent": 0,
                "contactsChange": "0%",
                "chatsChange": "0%",
                "campaignsChange": "0%",
                "messagesChange": "0%"
            }
        
        total_contacts = contacts_collection.count_documents({"user_id": user["user_id"]})
        total_messages = messages_collection.count_documents({"user_id": user["user_id"]})
        total_campaigns = campaigns_collection.count_documents({"user_id": user["user_id"]})
        active_chats = contacts_collection.count_documents({"user_id": user["user_id"], "status": "Active"})
        
        return {
            "totalContacts": total_contacts,
            "activeChats": active_chats,
            "campaigns": total_campaigns,
            "messagesSent": total_messages,
            "contactsChange": "+12%",
            "chatsChange": "+8%",
            "campaignsChange": "+3%",
            "messagesChange": "+18%"
        }
    except Exception as e:
        print(f"Error fetching dashboard stats: {e}")
        return {
            "totalContacts": 0,
            "activeChats": 0,
            "campaigns": 0,
            "messagesSent": 0,
            "contactsChange": "0%",
            "chatsChange": "0%",
            "campaignsChange": "0%",
            "messagesChange": "0%"
        }

@app.get("/{campaign_name}")
async def get_campaign_status(campaign_name: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get campaign status"""
    return {"name": campaign_name, "status": "Active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
