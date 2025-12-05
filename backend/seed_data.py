"""
Seed MongoDB with realistic data for WhatsApp Business Platform
"""
from database import Database, get_contacts_collection, get_messages_collection, get_campaigns_collection, get_templates_collection
from datetime import datetime, timedelta
import random

def seed_contacts():
    """Seed contacts collection with realistic data"""
    contacts_collection = get_contacts_collection()
    
    if contacts_collection is None:
        print("❌ MongoDB not connected")
        return
    
    # Clear existing data
    contacts_collection.delete_many({})
    
    contacts = [
        {
            "id": "1",
            "user_id": "default_user",
            "name": "Sarah Johnson",
            "phone": "+1 (555) 123-4567",
            "email": "sarah.johnson@email.com",
            "tags": ["VIP", "Customer"],
            "status": "Active",
            "lastMessage": "Thanks for the quick response!",
            "lastMessageTime": (datetime.now() - timedelta(hours=2)).isoformat(),
            "avatar": "SJ",
            "createdAt": (datetime.now() - timedelta(days=45)).isoformat()
        },
        {
            "id": "2",
            "user_id": "default_user",
            "name": "Michael Chen",
            "phone": "+1 (555) 234-5678",
            "email": "michael.chen@email.com",
            "tags": ["Lead", "Prospect"],
            "status": "Active",
            "lastMessage": "I'm interested in your premium plan",
            "lastMessageTime": (datetime.now() - timedelta(hours=5)).isoformat(),
            "avatar": "MC",
            "createdAt": (datetime.now() - timedelta(days=30)).isoformat()
        },
        {
            "id": "3",
            "user_id": "default_user",
            "name": "Emily Davis",
            "phone": "+1 (555) 345-6789",
            "email": "emily.davis@email.com",
            "tags": ["Customer", "Support"],
            "status": "Inactive",
            "lastMessage": "Got it, thank you!",
            "lastMessageTime": (datetime.now() - timedelta(days=1)).isoformat(),
            "avatar": "ED",
            "createdAt": (datetime.now() - timedelta(days=60)).isoformat()
        },
        {
            "id": "4",
            "user_id": "default_user",
            "name": "James Wilson",
            "phone": "+1 (555) 456-7890",
            "email": "james.wilson@company.com",
            "tags": ["VIP", "Enterprise"],
            "status": "Active",
            "lastMessage": "Can we schedule a demo?",
            "lastMessageTime": (datetime.now() - timedelta(hours=8)).isoformat(),
            "avatar": "JW",
            "createdAt": (datetime.now() - timedelta(days=90)).isoformat()
        },
        {
            "id": "5",
            "user_id": "default_user",
            "name": "Maria Garcia",
            "phone": "+1 (555) 567-8901",
            "email": "maria.garcia@email.com",
            "tags": ["Customer", "Loyal"],
            "status": "Active",
            "lastMessage": "Love your service!",
            "lastMessageTime": (datetime.now() - timedelta(hours=12)).isoformat(),
            "avatar": "MG",
            "createdAt": (datetime.now() - timedelta(days=120)).isoformat()
        },
        {
            "id": "6",
            "user_id": "default_user",
            "name": "David Brown",
            "phone": "+1 (555) 678-9012",
            "email": "david.brown@startup.io",
            "tags": ["Lead", "Tech"],
            "status": "Active",
            "lastMessage": "What's your pricing?",
            "lastMessageTime": (datetime.now() - timedelta(hours=15)).isoformat(),
            "avatar": "DB",
            "createdAt": (datetime.now() - timedelta(days=15)).isoformat()
        },
        {
            "id": "7",
            "user_id": "default_user",
            "name": "Lisa Anderson",
            "phone": "+1 (555) 789-0123",
            "email": "lisa.anderson@email.com",
            "tags": ["Customer", "Referral"],
            "status": "Active",
            "lastMessage": "My friend recommended you",
            "lastMessageTime": (datetime.now() - timedelta(hours=20)).isoformat(),
            "avatar": "LA",
            "createdAt": (datetime.now() - timedelta(days=10)).isoformat()
        },
        {
            "id": "8",
            "user_id": "default_user",
            "name": "Robert Taylor",
            "phone": "+1 (555) 890-1234",
            "email": "robert.taylor@corp.com",
            "tags": ["VIP", "Enterprise", "Partner"],
            "status": "Active",
            "lastMessage": "Let's discuss the partnership",
            "lastMessageTime": (datetime.now() - timedelta(hours=24)).isoformat(),
            "avatar": "RT",
            "createdAt": (datetime.now() - timedelta(days=180)).isoformat()
        },
        {
            "id": "9",
            "user_id": "default_user",
            "name": "Jennifer Martinez",
            "phone": "+1 (555) 901-2345",
            "email": "jennifer.martinez@email.com",
            "tags": ["Lead", "Prospect"],
            "status": "Active",
            "lastMessage": "Still thinking about it",
            "lastMessageTime": (datetime.now() - timedelta(days=2)).isoformat(),
            "avatar": "JM",
            "createdAt": (datetime.now() - timedelta(days=20)).isoformat()
        },
        {
            "id": "10",
            "user_id": "default_user",
            "name": "William Lee",
            "phone": "+1 (555) 012-3456",
            "email": "william.lee@business.com",
            "tags": ["Customer", "Support"],
            "status": "Active",
            "lastMessage": "Issue resolved, thanks!",
            "lastMessageTime": (datetime.now() - timedelta(hours=36)).isoformat(),
            "avatar": "WL",
            "createdAt": (datetime.now() - timedelta(days=75)).isoformat()
        },
        {
            "id": "11",
            "user_id": "default_user",
            "name": "Amanda White",
            "phone": "+1 (555) 123-7890",
            "email": "amanda.white@email.com",
            "tags": ["Customer", "Loyal", "VIP"],
            "status": "Active",
            "lastMessage": "When's the next update?",
            "lastMessageTime": (datetime.now() - timedelta(hours=48)).isoformat(),
            "avatar": "AW",
            "createdAt": (datetime.now() - timedelta(days=200)).isoformat()
        },
        {
            "id": "12",
            "user_id": "default_user",
            "name": "Christopher Moore",
            "phone": "+1 (555) 234-8901",
            "email": "chris.moore@tech.com",
            "tags": ["Lead", "Tech", "Startup"],
            "status": "Active",
            "lastMessage": "Sounds interesting!",
            "lastMessageTime": (datetime.now() - timedelta(hours=72)).isoformat(),
            "avatar": "CM",
            "createdAt": (datetime.now() - timedelta(days=5)).isoformat()
        },
        {
            "id": "13",
            "user_id": "default_user",
            "name": "Patricia Harris",
            "phone": "+1 (555) 345-9012",
            "email": "patricia.harris@email.com",
            "tags": ["Customer"],
            "status": "Inactive",
            "lastMessage": "Thanks for everything",
            "lastMessageTime": (datetime.now() - timedelta(days=30)).isoformat(),
            "avatar": "PH",
            "createdAt": (datetime.now() - timedelta(days=150)).isoformat()
        },
        {
            "id": "14",
            "user_id": "default_user",
            "name": "Daniel Clark",
            "phone": "+1 (555) 456-0123",
            "email": "daniel.clark@agency.com",
            "tags": ["Lead", "Agency"],
            "status": "Active",
            "lastMessage": "Can you send me more info?",
            "lastMessageTime": (datetime.now() - timedelta(hours=96)).isoformat(),
            "avatar": "DC",
            "createdAt": (datetime.now() - timedelta(days=8)).isoformat()
        },
        {
            "id": "15",
            "user_id": "default_user",
            "name": "Nancy Rodriguez",
            "phone": "+1 (555) 567-1234",
            "email": "nancy.rodriguez@email.com",
            "tags": ["Customer", "Referral"],
            "status": "Active",
            "lastMessage": "Perfect, exactly what I needed",
            "lastMessageTime": (datetime.now() - timedelta(hours=120)).isoformat(),
            "avatar": "NR",
            "createdAt": (datetime.now() - timedelta(days=25)).isoformat()
        }
    ]
    
    contacts_collection.insert_many(contacts)
    print(f"✅ Seeded {len(contacts)} contacts")

def seed_messages():
    """Seed messages collection with chat history"""
    messages_collection = get_messages_collection()
    
    if messages_collection is None:
        print("❌ MongoDB not connected")
        return
    
    # Clear existing data
    messages_collection.delete_many({})
    
    # Sample conversations for different contacts
    conversations = [
        # Sarah Johnson conversation
        {
            "phoneNumber": "+1 (555) 123-4567",
            "messages": [
                {"text": "Hi! I saw your ad on social media", "sent": False, "hours_ago": 48},
                {"text": "Hello Sarah! Thanks for reaching out. How can I help you today?", "sent": True, "hours_ago": 47},
                {"text": "I'm interested in your premium package", "sent": False, "hours_ago": 46},
                {"text": "Great choice! Our premium package includes unlimited messaging, advanced analytics, and priority support.", "sent": True, "hours_ago": 45},
                {"text": "That sounds perfect! How do I get started?", "sent": False, "hours_ago": 44},
                {"text": "I'll send you a signup link right away. You'll be up and running in minutes!", "sent": True, "hours_ago": 43},
                {"text": "Thanks for the quick response!", "sent": False, "hours_ago": 2}
            ]
        },
        # Michael Chen conversation
        {
            "phoneNumber": "+1 (555) 234-5678",
            "messages": [
                {"text": "Hello, I have a question about your services", "sent": False, "hours_ago": 24},
                {"text": "Hi Michael! I'd be happy to help. What would you like to know?", "sent": True, "hours_ago": 23},
                {"text": "What's the difference between your basic and premium plans?", "sent": False, "hours_ago": 22},
                {"text": "The basic plan includes 1,000 messages/month and standard support. Premium gives you unlimited messages, advanced analytics, API access, and priority support.", "sent": True, "hours_ago": 21},
                {"text": "I'm interested in your premium plan", "sent": False, "hours_ago": 5}
            ]
        },
        # James Wilson conversation
        {
            "phoneNumber": "+1 (555) 456-7890",
            "messages": [
                {"text": "Hi, I represent a large enterprise looking for a WhatsApp solution", "sent": False, "hours_ago": 72},
                {"text": "Hello James! We'd love to work with you. We have enterprise solutions with custom pricing and dedicated support.", "sent": True, "hours_ago": 71},
                {"text": "That's great. We need to handle about 50,000 messages per month", "sent": False, "hours_ago": 70},
                {"text": "No problem at all. Our enterprise plan can easily handle that volume. Would you like to schedule a demo?", "sent": True, "hours_ago": 69},
                {"text": "Can we schedule a demo?", "sent": False, "hours_ago": 8}
            ]
        },
        # Maria Garcia conversation
        {
            "phoneNumber": "+1 (555) 567-8901",
            "messages": [
                {"text": "I've been using your service for 3 months now", "sent": False, "hours_ago": 168},
                {"text": "That's wonderful Maria! How has your experience been?", "sent": True, "hours_ago": 167},
                {"text": "Absolutely fantastic! My customer engagement has increased by 40%", "sent": False, "hours_ago": 166},
                {"text": "That's amazing to hear! We're so glad we could help grow your business.", "sent": True, "hours_ago": 165},
                {"text": "Love your service!", "sent": False, "hours_ago": 12}
            ]
        }
    ]
    
    all_messages = []
    message_id = 1
    
    for conv in conversations:
        for msg in conv["messages"]:
            all_messages.append({
                "id": str(message_id),
                "phoneNumber": conv["phoneNumber"],
                "text": msg["text"],
                "timestamp": (datetime.now() - timedelta(hours=msg["hours_ago"])).isoformat(),
                "sent": msg["sent"],
                "status": "read",
                "user_id": "default_user"
            })
            message_id += 1
    
    messages_collection.insert_many(all_messages)
    print(f"✅ Seeded {len(all_messages)} messages")

def seed_campaigns():
    """Seed campaigns collection"""
    campaigns_collection = get_campaigns_collection()
    
    if campaigns_collection is None:
        print("❌ MongoDB not connected")
        return
    
    # Clear existing data
    campaigns_collection.delete_many({})
    
    campaigns = [
        {
            "id": "1",
            "user_id": "default_user",
            "name": "Summer Sale 2024",
            "status": "Active",
            "description": "Promotional campaign for our summer collection with exclusive discounts",
            "recipients": 2458,
            "sent": 2458,
            "delivered": 2385,
            "read": 1917,
            "readRate": "78%",
            "deliveryRate": "97%",
            "createdAt": "Mar 15, 2024",
            "scheduledAt": None
        },
        {
            "id": "2",
            "user_id": "default_user",
            "name": "Welcome Series",
            "status": "Active",
            "description": "Automated welcome messages for new subscribers with onboarding tips",
            "recipients": 1234,
            "sent": 1234,
            "delivered": 1197,
            "read": 1012,
            "readRate": "82%",
            "deliveryRate": "97%",
            "createdAt": "Mar 10, 2024",
            "scheduledAt": None
        },
        {
            "id": "3",
            "user_id": "default_user",
            "name": "Product Launch",
            "status": "Completed",
            "description": "Announcement campaign for our new product line with early bird offers",
            "recipients": 5678,
            "sent": 5678,
            "delivered": 5508,
            "read": 4259,
            "readRate": "75%",
            "deliveryRate": "97%",
            "createdAt": "Mar 5, 2024",
            "scheduledAt": None
        },
        {
            "id": "4",
            "user_id": "default_user",
            "name": "Customer Feedback Survey",
            "status": "Active",
            "description": "Collecting customer feedback to improve our services",
            "recipients": 892,
            "sent": 892,
            "delivered": 865,
            "read": 723,
            "readRate": "81%",
            "deliveryRate": "97%",
            "createdAt": "Apr 1, 2024",
            "scheduledAt": None
        },
        {
            "id": "5",
            "user_id": "default_user",
            "name": "Flash Sale Alert",
            "status": "Scheduled",
            "description": "24-hour flash sale notification for VIP customers",
            "recipients": 456,
            "sent": 0,
            "delivered": 0,
            "read": 0,
            "readRate": "0%",
            "deliveryRate": "0%",
            "createdAt": "Apr 10, 2024",
            "scheduledAt": "Apr 15, 2024 10:00 AM"
        },
        {
            "id": "6",
            "user_id": "default_user",
            "name": "Holiday Greetings",
            "status": "Completed",
            "description": "Seasonal greetings and special offers for the holiday season",
            "recipients": 3421,
            "sent": 3421,
            "delivered": 3318,
            "read": 2687,
            "readRate": "79%",
            "deliveryRate": "97%",
            "createdAt": "Dec 20, 2023",
            "scheduledAt": None
        },
        {
            "id": "7",
            "user_id": "default_user",
            "name": "Re-engagement Campaign",
            "status": "Active",
            "description": "Win back inactive customers with special incentives",
            "recipients": 1567,
            "sent": 1567,
            "delivered": 1520,
            "read": 1142,
            "readRate": "73%",
            "deliveryRate": "97%",
            "createdAt": "Mar 25, 2024",
            "scheduledAt": None
        },
        {
            "id": "8",
            "user_id": "default_user",
            "name": "New Feature Announcement",
            "status": "Draft",
            "description": "Introducing our latest features and improvements",
            "recipients": 0,
            "sent": 0,
            "delivered": 0,
            "read": 0,
            "readRate": "0%",
            "deliveryRate": "0%",
            "createdAt": "Apr 5, 2024",
            "scheduledAt": None
        }
    ]
    
    campaigns_collection.insert_many(campaigns)
    print(f"✅ Seeded {len(campaigns)} campaigns")

def seed_templates():
    """Seed templates collection"""
    templates_collection = get_templates_collection()
    
    if templates_collection is None:
        print("❌ MongoDB not connected")
        return
    
    # Clear existing data
    templates_collection.delete_many({})
    
    templates = [
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
        },
        {
            "id": "5",
            "name": "Appointment Reminder",
            "category": "utility",
            "status": "approved",
            "language": "English",
            "content": "Hi {{name}}, this is a reminder about your appointment on {{date}} at {{time}}. See you soon!",
            "parameters": ["name", "date", "time"],
            "usageCount": 678,
            "createdAt": "Feb 20, 2024"
        },
        {
            "id": "6",
            "name": "Shipping Update",
            "category": "transactional",
            "status": "approved",
            "language": "English",
            "content": "Good news {{name}}! Your order #{{order_id}} has been shipped. Track it here: {{tracking_url}}",
            "parameters": ["name", "order_id", "tracking_url"],
            "usageCount": 1523,
            "createdAt": "Mar 12, 2024"
        },
        {
            "id": "7",
            "name": "Payment Received",
            "category": "transactional",
            "status": "approved",
            "language": "English",
            "content": "Thank you {{name}}! We've received your payment of {{amount}}. Receipt: {{receipt_url}}",
            "parameters": ["name", "amount", "receipt_url"],
            "usageCount": 2156,
            "createdAt": "Jan 25, 2024"
        },
        {
            "id": "8",
            "name": "Feedback Request",
            "category": "marketing",
            "status": "approved",
            "language": "English",
            "content": "Hi {{name}}, how was your experience with us? We'd love to hear your feedback: {{survey_link}}",
            "parameters": ["name", "survey_link"],
            "usageCount": 892,
            "createdAt": "Mar 18, 2024"
        },
        {
            "id": "9",
            "name": "Password Reset",
            "category": "authentication",
            "status": "approved",
            "language": "English",
            "content": "Hi {{name}}, click here to reset your password: {{reset_link}}. This link expires in 1 hour.",
            "parameters": ["name", "reset_link"],
            "usageCount": 1345,
            "createdAt": "Feb 5, 2024"
        },
        {
            "id": "10",
            "name": "Event Invitation",
            "category": "marketing",
            "status": "approved",
            "language": "English",
            "content": "You're invited, {{name}}! Join us for {{event_name}} on {{date}}. RSVP: {{rsvp_link}}",
            "parameters": ["name", "event_name", "date", "rsvp_link"],
            "usageCount": 567,
            "createdAt": "Mar 22, 2024"
        },
        {
            "id": "11",
            "name": "Subscription Renewal",
            "category": "transactional",
            "status": "approved",
            "language": "English",
            "content": "Hi {{name}}, your subscription will renew on {{date}} for {{amount}}. Manage subscription: {{link}}",
            "parameters": ["name", "date", "amount", "link"],
            "usageCount": 734,
            "createdAt": "Feb 28, 2024"
        },
        {
            "id": "12",
            "name": "Cart Abandonment",
            "category": "marketing",
            "status": "approved",
            "language": "English",
            "content": "Hi {{name}}, you left items in your cart! Complete your purchase now and get {{discount}}% off: {{cart_link}}",
            "parameters": ["name", "discount", "cart_link"],
            "usageCount": 1876,
            "createdAt": "Mar 8, 2024"
        }
    ]
    
    templates_collection.insert_many(templates)
    print(f"✅ Seeded {len(templates)} templates")

if __name__ == "__main__":
    print("🌱 Seeding MongoDB with data...")
    print()
    
    # Connect to MongoDB
    Database.connect()
    
    if not Database.is_connected():
        print("❌ Failed to connect to MongoDB. Please check your connection.")
        exit(1)
    
    # Seed all collections
    seed_contacts()
    seed_messages()
    seed_campaigns()
    seed_templates()
    
    print()
    print("✅ Database seeding complete!")
    print("🎉 Your MongoDB is now populated with realistic data")
