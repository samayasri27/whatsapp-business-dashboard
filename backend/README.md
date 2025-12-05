# WhatsApp Business Backend API

FastAPI backend for WhatsApp Business Dashboard with MongoDB integration.

## 🚀 Features

- ✅ RESTful API with FastAPI
- ✅ MongoDB database integration
- ✅ JWT authentication
- ✅ WhatsApp Business API integration
- ✅ Google Sheets integration
- ✅ CORS enabled for frontend
- ✅ Pydantic models for validation
- ✅ Environment-based configuration

## 📦 Tech Stack

- **Framework**: FastAPI
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: Pydantic
- **Server**: Uvicorn

## 🛠️ Installation

### Prerequisites

- Python 3.8+
- MongoDB (local or cloud)
- WhatsApp Business API credentials

### Setup

1. **Navigate to backend directory**
```bash
cd whatsapp-backend
```

2. **Create virtual environment**
```bash
python -m venv venv

# Activate on macOS/Linux
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**

Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Edit `.env`:
```env
JWT_SECRET=your_secret_token_here
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=whatsapp_business
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
```

5. **Run the server**
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔌 API Endpoints

### Authentication
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer your_jwt_token
```

### Endpoints

#### Health Check
```
GET /
```

#### Contacts
```
GET /users?login_user={user_id}
GET /tags
```

#### Chats
```
GET /chats/{phone_number}
POST /send
```

#### Campaigns
```
GET /campaigns
GET /campaign_contacts?campaign={name}
GET /imported_numbers?sheet_name={name}
GET /{campaign_name}
```

#### Templates
```
GET /templates
```

#### Sheets
```
GET /sheets
```

## 📁 Project Structure

```
whatsapp-backend/
├── main.py              # FastAPI application
├── database.py          # MongoDB connection
├── models.py            # Pydantic models
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
├── .env                 # Environment variables (create this)
└── README.md           # This file
```

## 🔒 Security

- JWT token authentication on all endpoints
- CORS configured for specific origins
- Environment variables for sensitive data
- MongoDB connection with authentication

## 🗄️ Database Schema

### Collections

#### contacts
```json
{
  "id": "string",
  "name": "string",
  "phone": "string",
  "email": "string",
  "tags": ["string"],
  "status": "Active|Inactive|Blocked",
  "lastMessage": "string",
  "createdAt": "datetime"
}
```

#### messages
```json
{
  "id": "string",
  "phoneNumber": "string",
  "text": "string",
  "timestamp": "datetime",
  "sent": "boolean",
  "status": "sent|delivered|read"
}
```

#### campaigns
```json
{
  "id": "string",
  "name": "string",
  "status": "Active|Paused|Completed",
  "recipients": "number",
  "sent": "number",
  "delivered": "number",
  "read": "number",
  "createdAt": "datetime"
}
```

#### templates
```json
{
  "id": "string",
  "name": "string",
  "category": "utility|marketing|transactional",
  "status": "approved|pending|rejected",
  "content": "string",
  "parameters": ["string"],
  "usageCount": "number"
}
```

## 🔗 Integration with Frontend

The frontend Next.js app connects to this backend via:

```typescript
// Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_JWT_TOKEN=your_jwt_token_here
```

## 🚀 Deployment

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t whatsapp-backend .
docker run -p 8000:8000 --env-file .env whatsapp-backend
```

### Using Heroku

```bash
heroku create whatsapp-backend
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URL=your_mongodb_url
git push heroku main
```

## 🧪 Testing

```bash
# Install testing dependencies
pip install pytest httpx

# Run tests
pytest
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `MONGODB_URL` | MongoDB connection string | Yes |
| `MONGODB_DB_NAME` | Database name | Yes |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp API token | Yes |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp phone number ID | Yes |
| `CORS_ORIGINS` | Allowed CORS origins | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is part of a hackathon submission.
