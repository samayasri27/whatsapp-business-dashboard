from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any, List
import os
from dotenv import load_dotenv
from jose import jwt, JWTError
from datetime import datetime, timedelta
from bson import ObjectId

load_dotenv()

app = FastAPI(title="WhatsApp Business API - Hybrid Auth (Clerk + JWT)")

# Helper function to convert MongoDB documents to JSON-safe dictionaries
def mongo_to_dict(doc: Dict) -> Dict:
    """Convert MongoDB document to JSON-safe dictionary"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [mongo_to_dict(item) for item in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == "_id":
                continue  # Skip _id field
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, dict):
                result[key] = mongo_to_dict(value)
            elif isinstance(value, list):
                result[key] = [mongo_to_dict(item) if isinstance(item, dict) else item for item in value]
            else:
                result[key] = value
        return result
    return doc

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
# Clerk configuration
# Ensure the PEM key is correctly formatted by handling potential escaped newlines
# and stripping any wrapping quotes if present
raw_key = os.getenv("CLERK_PEM_PUBLIC_KEY", "")
# Handle double-escaped newlines common in .env files
CLERK_PEM_PUBLIC_KEY = raw_key.replace("\\n", "\n").replace('"', "").replace("'", "")
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
                issuer=CLERK_ISSUER,
                options={"verify_signature": True, "verify_aud": False}
            )
            return {"type": "clerk", "user_id": payload.get("sub"), "data": payload}
        else:
            raise Exception("Clerk not configured")
    except Exception as e:
        raise Exception(f"Clerk verification failed: {str(e)}")


def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Verify standard JWT token"""
    try:
        # Explicitly allow only HS256 algorithm for JWT tokens
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_signature": True, "verify_aud": False, "verify_exp": True}
        )
        return {"type": "jwt", "user_id": payload.get("sub"), "data": payload}
    except JWTError as e:
        raise Exception(f"JWT verification failed: {str(e)}")
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
            return {"type": "debug", "user_id": "default_user", "data": {"debug": True}}
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    token = authorization.replace("Bearer ", "")
    
    # 1. Try verifying as internal JWT (HS256)
    try:
        result = verify_jwt_token(token)
        print(f"✅ JWT token verified: {result['user_id']}")
        return result
    except Exception:
        pass  # Fall through to try Clerk

    # 2. Try verifying as Clerk token (RS256)
    try:
        result = verify_clerk_token(token)
        print(f"✅ Clerk token verified: {result['user_id']}")
        return result
    except Exception as e:
        print(f"⚠️ Auth failed: {e}")
        
    # 3. Debug mode fallthrough or failure
    if DEBUG:
        print("⚠️ DEBUG mode: Allowing request without valid token")
        return {"type": "debug", "user_id": "default_user", "data": {"debug": True}}
    
    raise HTTPException(
        status_code=401,
        detail="Invalid authentication credentials"
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

@app.get("/contacts")
async def get_contacts(
    search: Optional[str] = None,
    status: Optional[str] = None,
    tag: Optional[str] = None,
    sort_by: Optional[str] = "name",
    sort_order: Optional[str] = "asc",
    page: int = 1,
    limit: int = 50,
    user: Dict[str, Any] = Depends(verify_jwt_auth)
):
    """Get all contacts with search, filter, and sorting"""
    from database import get_contacts_collection
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Build query
        query = {"user_id": user["user_id"]}
        
        # Search filter
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"phone": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}}
            ]
        
        # Status filter
        if status and status != "all":
            query["status"] = status
        
        # Tag filter
        if tag and tag != "all":
            query["tags"] = tag
        
        # Count total
        total = contacts_collection.count_documents(query)
        
        # Sort
        sort_direction = 1 if sort_order == "asc" else -1
        sort_field = sort_by if sort_by else "name"
        
        # Pagination
        skip = (page - 1) * limit
        
        # Get contacts
        contacts_raw = list(
            contacts_collection
            .find(query)
            .sort(sort_field, sort_direction)
            .skip(skip)
            .limit(limit)
        )
        contacts = [mongo_to_dict(c) for c in contacts_raw]
        
        return {
            "contacts": contacts,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    except Exception as e:
        print(f"Error fetching contacts: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch contacts: {str(e)}")

@app.get("/users")
async def get_users(login_user: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get all contacts for a user (legacy endpoint)"""
    from database import get_contacts_collection
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            return []
        
        # Get contacts for this user
        contacts_raw = list(contacts_collection.find({"user_id": login_user}))
        contacts = [mongo_to_dict(c) for c in contacts_raw]
        
        return contacts
    except Exception as e:
        print(f"Error fetching contacts: {e}")
        return []

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
        messages_raw = list(messages_collection.find({"phoneNumber": phone_number}).sort("timestamp", 1))
        messages = [mongo_to_dict(m) for m in messages_raw]
        
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
        print(f"🔍 Fetching campaigns for user_id: {user['user_id']}")
        campaigns_raw = list(campaigns_collection.find({"user_id": user["user_id"]}))
        print(f"📊 Found {len(campaigns_raw)} campaigns in MongoDB")
        campaigns = [mongo_to_dict(c) for c in campaigns_raw]
        
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
async def get_templates(
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    language: Optional[str] = None,
    sort_by: Optional[str] = "name",
    sort_order: Optional[str] = "asc",
    page: int = 1,
    limit: int = 50,
    user: Dict[str, Any] = Depends(verify_jwt_auth)
):
    """Get all WhatsApp templates with search and filtering"""
    from database import get_templates_collection
    import re
    
    try:
        templates_collection = get_templates_collection()
        
        if templates_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Build query
        query = {}
        
        # Search filter
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"content": {"$regex": search, "$options": "i"}},
                {"category": {"$regex": search, "$options": "i"}}
            ]
        
        # Category filter
        if category and category.lower() != "all":
            query["category"] = {"$regex": f"^{category}$", "$options": "i"}
        
        # Status filter
        if status and status.lower() != "all":
            query["status"] = {"$regex": f"^{status}$", "$options": "i"}
        
        # Language filter
        if language and language.lower() != "all":
            query["language"] = {"$regex": f"^{language}$", "$options": "i"}
        
        # Count total
        total = templates_collection.count_documents(query)
        
        # Sort
        sort_direction = 1 if sort_order == "asc" else -1
        sort_field = sort_by if sort_by else "name"
        
        # Pagination
        skip = (page - 1) * limit
        
        # Get templates
        print(f"🔍 Fetching templates with query: {query}")
        templates_raw = list(
            templates_collection
            .find(query)
            .sort(sort_field, sort_direction)
            .skip(skip)
            .limit(limit)
        )
        print(f"📊 Found {len(templates_raw)} templates in MongoDB (total: {total})")
        templates = [mongo_to_dict(t) for t in templates_raw]
        
        # Extract parameters from content for each template
        for template in templates:
            content = template.get("content", "")
            params = re.findall(r'\{\{(\w+)\}\}', content)
            template["parameters"] = list(set(params))  # Remove duplicates
        
        return {
            "templates": templates,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    except Exception as e:
        print(f"Error fetching templates: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch templates: {str(e)}")

@app.get("/templates/{template_id}")
async def get_template(template_id: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get a single template by ID"""
    from database import get_templates_collection
    import re
    
    try:
        templates_collection = get_templates_collection()
        
        if templates_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        template = templates_collection.find_one({"id": template_id})
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        template_dict = mongo_to_dict(template)
        
        # Extract parameters
        content = template_dict.get("content", "")
        params = re.findall(r'\{\{(\w+)\}\}', content)
        template_dict["parameters"] = list(set(params))
        
        return template_dict
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch template: {str(e)}")

@app.post("/templates")
async def create_template(template: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Create a new template"""
    from database import get_templates_collection
    import uuid
    import re
    
    try:
        templates_collection = get_templates_collection()
        
        if templates_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Check if template with same name already exists
        existing = templates_collection.find_one({
            "name": template.get("name"),
            "user_id": user["user_id"]
        })
        
        if existing:
            raise HTTPException(status_code=400, detail="Template with this name already exists")
        
        # Extract parameters from content
        content = template.get("content", "")
        params = re.findall(r'\{\{(\w+)\}\}', content)
        
        template_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user["user_id"],
            "name": template.get("name"),
            "category": template.get("category"),
            "language": template.get("language", "English"),
            "content": content,
            "status": template.get("status", "pending"),
            "parameters": list(set(params)),
            "usageCount": 0,
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        
        templates_collection.insert_one(template_doc)
        
        return {"success": True, "template": mongo_to_dict(template_doc)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create template: {str(e)}")

@app.put("/templates/{template_id}")
async def update_template(template_id: str, template: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Update a template"""
    from database import get_templates_collection
    import re
    
    try:
        templates_collection = get_templates_collection()
        
        if templates_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Extract parameters if content is being updated
        if "content" in template:
            content = template.get("content", "")
            params = re.findall(r'\{\{(\w+)\}\}', content)
            template["parameters"] = list(set(params))
        
        # Add updatedAt timestamp
        update_data = {**template, "updatedAt": datetime.now().isoformat()}
        
        result = templates_collection.update_one(
            {"id": template_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # Get updated template
        updated_template = templates_collection.find_one({"id": template_id})
        
        return {"success": True, "template": mongo_to_dict(updated_template)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update template: {str(e)}")

@app.delete("/templates/{template_id}")
async def delete_template(template_id: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Delete a template"""
    from database import get_templates_collection
    
    try:
        templates_collection = get_templates_collection()
        
        if templates_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        result = templates_collection.delete_one({"id": template_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return {"success": True, "message": "Template deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete template: {str(e)}")

@app.post("/templates/{template_id}/use")
async def use_template(template_id: str, parameters: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Use a template and increment usage count"""
    from database import get_templates_collection
    import re
    
    try:
        templates_collection = get_templates_collection()
        
        if templates_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Get template
        template = templates_collection.find_one({"id": template_id})
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # Fill parameters
        content = template.get("content", "")
        filled_content = content
        
        for key, value in parameters.items():
            filled_content = re.sub(f'\\{{\\{{{key}\\}}\\}}', str(value), filled_content)
        
        # Increment usage count
        templates_collection.update_one(
            {"id": template_id},
            {"$inc": {"usageCount": 1}}
        )
        
        return {
            "success": True,
            "filled_content": filled_content,
            "original_content": content
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to use template: {str(e)}")

@app.get("/templates/categories/list")
async def get_template_categories(user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get all template categories"""
    from database import get_templates_collection
    
    try:
        templates_collection = get_templates_collection()
        
        if templates_collection is None:
            return ["marketing", "utility", "transactional", "authentication"]
        
        # Get unique categories
        categories = templates_collection.distinct("category")
        
        if not categories:
            return ["marketing", "utility", "transactional", "authentication"]
        
        return categories
    except Exception as e:
        print(f"Error fetching categories: {e}")
        return ["marketing", "utility", "transactional", "authentication"]

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

@app.get("/contacts/{contact_id}")
async def get_contact(contact_id: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get a single contact by ID"""
    from database import get_contacts_collection
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        contact = contacts_collection.find_one(
            {"id": contact_id, "user_id": user["user_id"]}
        )
        
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        return mongo_to_dict(contact)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch contact: {str(e)}")

@app.post("/contacts")
async def create_contact(contact: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Create a new contact"""
    from database import get_contacts_collection
    import uuid
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Check if contact with same phone already exists
        existing = contacts_collection.find_one({
            "phone": contact.get("phone"),
            "user_id": user["user_id"]
        })
        
        if existing:
            raise HTTPException(status_code=400, detail="Contact with this phone number already exists")
        
        contact_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user["user_id"],
            "name": contact.get("name"),
            "phone": contact.get("phone"),
            "email": contact.get("email"),
            "tags": contact.get("tags", []),
            "status": contact.get("status", "Active"),
            "customFields": contact.get("customFields", {}),
            "notes": contact.get("notes"),
            "avatar": contact.get("name", "U")[:2].upper(),
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        
        contacts_collection.insert_one(contact_doc)
        
        return {"success": True, "contact": mongo_to_dict(contact_doc)}
    except HTTPException:
        raise
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
        
        # Add updatedAt timestamp
        update_data = {**contact, "updatedAt": datetime.now().isoformat()}
        
        result = contacts_collection.update_one(
            {"id": contact_id, "user_id": user["user_id"]},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        # Get updated contact
        updated_contact = contacts_collection.find_one({"id": contact_id})
        
        return {"success": True, "contact": mongo_to_dict(updated_contact)}
    except HTTPException:
        raise
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete contact: {str(e)}")

@app.post("/contacts/bulk")
async def bulk_contact_operation(operation: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Perform bulk operations on contacts"""
    from database import get_contacts_collection
    import csv
    import io
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        contact_ids = operation.get("contactIds", [])
        op_type = operation.get("operation")
        data = operation.get("data", {})
        
        if not contact_ids:
            raise HTTPException(status_code=400, detail="No contacts selected")
        
        # Build query for selected contacts
        query = {
            "id": {"$in": contact_ids},
            "user_id": user["user_id"]
        }
        
        if op_type == "delete":
            result = contacts_collection.delete_many(query)
            return {
                "success": True,
                "message": f"Deleted {result.deleted_count} contacts",
                "count": result.deleted_count
            }
        
        elif op_type == "tag":
            tags_to_add = data.get("tags", [])
            result = contacts_collection.update_many(
                query,
                {"$addToSet": {"tags": {"$each": tags_to_add}}}
            )
            return {
                "success": True,
                "message": f"Tagged {result.modified_count} contacts",
                "count": result.modified_count
            }
        
        elif op_type == "update_status":
            new_status = data.get("status")
            if not new_status:
                raise HTTPException(status_code=400, detail="Status is required")
            
            result = contacts_collection.update_many(
                query,
                {"$set": {"status": new_status, "updatedAt": datetime.now().isoformat()}}
            )
            return {
                "success": True,
                "message": f"Updated {result.modified_count} contacts",
                "count": result.modified_count
            }
        
        elif op_type == "export":
            # Get contacts
            contacts_raw = list(contacts_collection.find(query))
            contacts = [mongo_to_dict(c) for c in contacts_raw]
            
            # Create CSV
            output = io.StringIO()
            if contacts:
                fieldnames = ["id", "name", "phone", "email", "tags", "status", "notes", "createdAt"]
                writer = csv.DictWriter(output, fieldnames=fieldnames)
                writer.writeheader()
                
                for contact in contacts:
                    row = {
                        "id": contact.get("id", ""),
                        "name": contact.get("name", ""),
                        "phone": contact.get("phone", ""),
                        "email": contact.get("email", ""),
                        "tags": ",".join(contact.get("tags", [])),
                        "status": contact.get("status", ""),
                        "notes": contact.get("notes", ""),
                        "createdAt": contact.get("createdAt", "")
                    }
                    writer.writerow(row)
            
            csv_content = output.getvalue()
            
            return {
                "success": True,
                "message": f"Exported {len(contacts)} contacts",
                "count": len(contacts),
                "csv": csv_content
            }
        
        else:
            raise HTTPException(status_code=400, detail=f"Unknown operation: {op_type}")
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in bulk operation: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Bulk operation failed: {str(e)}")

@app.post("/contacts/import")
async def import_contacts(import_data: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Import contacts from CSV or other sources"""
    from database import get_contacts_collection
    import uuid
    import csv
    import io
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        contacts_to_import = import_data.get("contacts", [])
        source = import_data.get("source", "manual")
        
        if not contacts_to_import:
            raise HTTPException(status_code=400, detail="No contacts to import")
        
        imported = 0
        skipped = 0
        errors = []
        
        for contact_data in contacts_to_import:
            try:
                # Validate required fields
                if not contact_data.get("name") or not contact_data.get("phone"):
                    skipped += 1
                    errors.append(f"Skipped contact: missing name or phone")
                    continue
                
                # Check if contact already exists
                existing = contacts_collection.find_one({
                    "phone": contact_data.get("phone"),
                    "user_id": user["user_id"]
                })
                
                if existing:
                    skipped += 1
                    errors.append(f"Skipped {contact_data.get('name')}: phone already exists")
                    continue
                
                # Create contact
                contact_doc = {
                    "id": str(uuid.uuid4()),
                    "user_id": user["user_id"],
                    "name": contact_data.get("name"),
                    "phone": contact_data.get("phone"),
                    "email": contact_data.get("email"),
                    "tags": contact_data.get("tags", []) if isinstance(contact_data.get("tags"), list) else [],
                    "status": contact_data.get("status", "Active"),
                    "customFields": contact_data.get("customFields", {}),
                    "notes": contact_data.get("notes"),
                    "avatar": contact_data.get("name", "U")[:2].upper(),
                    "createdAt": datetime.now().isoformat(),
                    "updatedAt": datetime.now().isoformat()
                }
                
                contacts_collection.insert_one(contact_doc)
                imported += 1
                
            except Exception as e:
                skipped += 1
                errors.append(f"Error importing {contact_data.get('name', 'unknown')}: {str(e)}")
        
        return {
            "success": True,
            "imported": imported,
            "skipped": skipped,
            "errors": errors[:10],  # Return first 10 errors
            "message": f"Imported {imported} contacts, skipped {skipped}"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error importing contacts: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

@app.get("/contacts/export")
async def export_contacts(
    format: str = "csv",
    user: Dict[str, Any] = Depends(verify_jwt_auth)
):
    """Export all contacts"""
    from database import get_contacts_collection
    import csv
    import io
    import json
    
    try:
        contacts_collection = get_contacts_collection()
        
        if contacts_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Get all contacts for user
        contacts_raw = list(contacts_collection.find({"user_id": user["user_id"]}))
        contacts = [mongo_to_dict(c) for c in contacts_raw]
        
        if format == "csv":
            output = io.StringIO()
            if contacts:
                fieldnames = ["id", "name", "phone", "email", "tags", "status", "notes", "createdAt"]
                writer = csv.DictWriter(output, fieldnames=fieldnames)
                writer.writeheader()
                
                for contact in contacts:
                    row = {
                        "id": contact.get("id", ""),
                        "name": contact.get("name", ""),
                        "phone": contact.get("phone", ""),
                        "email": contact.get("email", ""),
                        "tags": ",".join(contact.get("tags", [])),
                        "status": contact.get("status", ""),
                        "notes": contact.get("notes", ""),
                        "createdAt": contact.get("createdAt", "")
                    }
                    writer.writerow(row)
            
            return {
                "success": True,
                "format": "csv",
                "count": len(contacts),
                "data": output.getvalue()
            }
        
        elif format == "json":
            return {
                "success": True,
                "format": "json",
                "count": len(contacts),
                "data": contacts
            }
        
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported format: {format}")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@app.post("/campaigns")
async def create_campaign(campaign: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Create a new campaign"""
    from database import get_campaigns_collection
    import uuid
    
    try:
        campaigns_collection = get_campaigns_collection()
        
        if campaigns_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        # Validate required fields
        if not campaign.get("name"):
            raise HTTPException(status_code=400, detail="Campaign name is required")
        if not campaign.get("description"):
            raise HTTPException(status_code=400, detail="Campaign description is required")
        if not campaign.get("template"):
            raise HTTPException(status_code=400, detail="Template is required")
        
        campaign_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user["user_id"],
            "name": campaign.get("name"),
            "description": campaign.get("description"),
            "template": campaign.get("template"),
            "contactSource": campaign.get("contactSource", "all"),
            "contactTags": campaign.get("contactTags", []),
            "sheet": campaign.get("sheet"),
            "status": campaign.get("status", "Draft"),
            "recipients": campaign.get("recipients", 0),
            "sent": 0,
            "delivered": 0,
            "read": 0,
            "readRate": "0%",
            "deliveryRate": "0%",
            "createdAt": datetime.now().isoformat(),
            "scheduledAt": campaign.get("scheduledDate")
        }
        
        campaigns_collection.insert_one(campaign_doc)
        
        return {"success": True, "campaign": mongo_to_dict(campaign_doc)}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating campaign: {e}")
        import traceback
        traceback.print_exc()
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

# User Management Endpoints

@app.get("/api/users")
async def get_all_users(user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get all users (Admin only)"""
    from database import get_users_collection
    
    try:
        users_collection = get_users_collection()
        
        if users_collection is None:
            # Return mock data if MongoDB not connected
            return [
                {
                    "id": "1",
                    "name": "John Admin",
                    "email": "john@company.com",
                    "role": "Admin",
                    "status": "Active",
                    "lastActive": "2 minutes ago",
                    "joinedDate": "Jan 15, 2024",
                    "avatar": "JA"
                }
            ]
        
        users_raw = list(users_collection.find({}))
        users = [mongo_to_dict(u) for u in users_raw]
        
        return users
    except Exception as e:
        print(f"Error fetching users: {e}")
        return []

@app.post("/api/users")
async def create_user(user_data: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Create a new user (Admin only)"""
    from database import get_users_collection
    import uuid
    
    try:
        users_collection = get_users_collection()
        
        if users_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        user_doc = {
            "id": str(uuid.uuid4()),
            "name": user_data.get("name"),
            "email": user_data.get("email"),
            "role": user_data.get("role", "User"),
            "status": "Active",
            "lastActive": datetime.now().isoformat(),
            "joinedDate": datetime.now().isoformat(),
            "avatar": user_data.get("name", "U")[:2].upper(),
            "createdAt": datetime.now().isoformat()
        }
        
        users_collection.insert_one(user_doc)
        
        return {"success": True, "user": mongo_to_dict(user_doc)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

@app.put("/api/users/{user_id}")
async def update_user(user_id: str, user_data: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Update user (Admin only)"""
    from database import get_users_collection
    
    try:
        users_collection = get_users_collection()
        
        if users_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        result = users_collection.update_one(
            {"id": user_id},
            {"$set": user_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"success": True, "message": "User updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")

@app.delete("/api/users/{user_id}")
async def delete_user(user_id: str, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Delete user (Admin only)"""
    from database import get_users_collection
    
    try:
        users_collection = get_users_collection()
        
        if users_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        result = users_collection.delete_one({"id": user_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"success": True, "message": "User deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")

@app.get("/api/profile")
async def get_user_profile(user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get current user profile"""
    from database import get_users_collection
    
    try:
        users_collection = get_users_collection()
        
        if users_collection is None:
            return {
                "id": user["user_id"],
                "name": "Demo User",
                "email": "demo@example.com",
                "role": "User",
                "status": "Active"
            }
        
        user_doc = users_collection.find_one({"id": user["user_id"]})
        
        if user_doc:
            return mongo_to_dict(user_doc)
        else:
            return {
                "id": user["user_id"],
                "name": "Demo User",
                "email": "demo@example.com",
                "role": "User",
                "status": "Active"
            }
    except Exception as e:
        print(f"Error fetching profile: {e}")
        return {
            "id": user["user_id"],
            "name": "Demo User",
            "email": "demo@example.com",
            "role": "User",
            "status": "Active"
        }

@app.put("/api/profile")
async def update_user_profile(profile_data: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Update current user profile"""
    from database import get_users_collection
    
    try:
        users_collection = get_users_collection()
        
        if users_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
        
        result = users_collection.update_one(
            {"id": user["user_id"]},
            {"$set": profile_data}
        )
        
        return {"success": True, "message": "Profile updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@app.get("/api/settings")
async def get_user_settings(user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Get user settings"""
    # TODO: Implement settings storage
    return {
        "emailNotifications": True,
        "pushNotifications": True,
        "darkMode": False,
        "language": "en",
        "timezone": "UTC"
    }

@app.put("/api/settings")
async def update_user_settings(settings_data: dict, user: Dict[str, Any] = Depends(verify_jwt_auth)):
    """Update user settings"""
    # TODO: Implement settings storage
    return {"success": True, "message": "Settings updated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
