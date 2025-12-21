
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="WhatsApp Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAIN_APP_URL = os.environ.get("MAIN_APP_URL", "http://localhost:8000/webhooks/inbound")

class InboundMessage(BaseModel):
    phone_number: str
    message: str

@app.post("/simulate/send")
async def send_simulated_message(data: InboundMessage):
    """
    Send a message from Simulator -> Main App (Webhook)
    """
    try:
        # Simulate the payload WhatsApp would send
        payload = {
            "from": data.phone_number,
            "text": data.message,
            "timestamp": "1234567890"
        }
        
        print(f"Sending to Main App: {payload} -> {MAIN_APP_URL}")
        
        response = requests.post(MAIN_APP_URL, json=payload)
        
        if response.status_code == 200:
            return {"status": "sent", "response": response.json()}
        else:
            return {"status": "failed", "error": response.text, "code": response.status_code}
            
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@app.get("/simulate/chats/{phone_number}")
async def get_simulated_chat(phone_number: str):
    """
    Get chat history for simulator sync
    """
    try:
        from pymongo import MongoClient
        import certifi
        
        # Connect to same DB as main app
        mongodb_url = os.environ.get("MONGODB_URL", "mongodb+srv://avenger3202_db_user:3J03D2NCKyTRcCmJ@wbusinesscluster1.vctizdk.mongodb.net/?retryWrites=true&w=majority")
        db_name = os.environ.get("MONGODB_DB_NAME", "whatsapp-business")
        
        client = MongoClient(
             mongodb_url,
             tls=True,
             tlsCAFile=certifi.where()
        )
        db = client[db_name]
        messages_collection = db["messages"]
        
        messages = list(messages_collection.find({"phoneNumber": phone_number}).sort("timestamp", 1))
        
        # Convert ObjectId
        for m in messages:
            if "_id" in m: m["_id"] = str(m["_id"])
            
        return {"messages": messages}
    except Exception as e:
        print(f"Error fetching simulator chat: {e}")
        return {"messages": []}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9001)
