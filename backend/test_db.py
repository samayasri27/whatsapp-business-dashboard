from database import get_contacts_collection
import os
from dotenv import load_dotenv

load_dotenv()

print('MongoDB URL:', os.getenv('MONGODB_URL')[:50] + '...')
print('DB Name:', os.getenv('MONGODB_DB_NAME'))

contacts_collection = get_contacts_collection()
if contacts_collection is not None:
    count = contacts_collection.count_documents({})
    print(f'Total contacts in database: {count}')
    
    # Get first 5 contacts
    contacts = list(contacts_collection.find({}).limit(5))
    print(f'\nSample contacts:')
    for contact in contacts:
        print(f'  - Name: {contact.get("name")}')
        print(f'    Phone: {contact.get("phone")}')
        print(f'    Email: {contact.get("email")}')
        print(f'    Tags: {contact.get("tags")}')
        print(f'    ID: {contact.get("id") or contact.get("_id")}')
        print()
else:
    print('Failed to connect to MongoDB')
