#!/bin/bash

echo "Testing campaign creation endpoint..."
echo ""

# Test data
curl -X POST http://localhost:8000/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token" \
  -d '{
    "name": "Test Campaign",
    "description": "This is a test campaign",
    "template": "1",
    "contactSource": "all",
    "recipients": 100,
    "status": "Draft"
  }' | jq '.'

echo ""
echo "Test complete!"
