import os
from dotenv import load_dotenv
from pymongo import MongoClient
import sys
import ssl
import certifi
import pymongo

load_dotenv()

uri = os.getenv("MONGODB_URL")
if not uri:
    print("Error: MONGODB_URL not found in .env")
    sys.exit(1)

# Mask the password in the URI for display
masked_uri = uri
if "@" in uri:
    part1, part2 = uri.split("@")
    if "//" in part1:
        scheme, creds = part1.split("//")
        masked_uri = f"{scheme}//<HIDDEN>:<HIDDEN>@{part2}"

print(f"Testing Connection to: {masked_uri}")
print(f"Python Version: {sys.version.split()[0]}")
print(f"PyMongo Version: {pymongo.__version__}")
print(f"OpenSSL Version: {ssl.OPENSSL_VERSION}")
print(f"Certifi Path: {certifi.where()}")

print("\n--- Attempt 1: Default Connection ---")
try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    # Trigger connection
    client.admin.command('ping')
    print("✅ Success! Connected to MongoDB.")
    dbs = client.list_database_names()
    print(f"Available Databases: {dbs}")
except Exception as e:
    print(f"❌ Failed: {e}")

print("\n--- Attempt 2: Explicit Certifi (tlsCAFile) ---")
try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000, tls=True, tlsCAFile=certifi.where())
    client.admin.command('ping')
    print("✅ Success! Connected with Certifi.")
    dbs = client.list_database_names()
    print(f"Available Databases: {dbs}")
except Exception as e:
    print(f"❌ Failed: {e}")
