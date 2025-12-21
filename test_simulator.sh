#!/bin/bash

# Test script for WhatsApp Simulator

echo "🚀 Testing WhatsApp Simulator..."

# Test 1: Send a message from simulator
echo "📤 Sending test message..."
curl -X POST "http://localhost:9001/simulate/send" \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+15550999", "message": "Test message from simulator script"}'

echo -e "\n"

# Test 2: Check if message appears in main app
echo "📥 Checking messages in main app..."
curl -X GET "http://localhost:8000/chats/%2B15550999" \
  -H "Authorization: Bearer debug_token"

echo -e "\n"

# Test 3: Check if contact was created
echo "👤 Checking if contact was created..."
curl -X GET "http://localhost:8000/contacts?search=0999" \
  -H "Authorization: Bearer debug_token"

echo -e "\n✅ Test completed!"