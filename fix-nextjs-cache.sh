#!/bin/bash

echo "🔧 Fixing Next.js cache issues..."

cd frontend

echo "📦 Removing .next directory..."
rm -rf .next

echo "🗑️  Removing node_modules/.cache..."
rm -rf node_modules/.cache

echo "✨ Cache cleared successfully!"
echo ""
echo "Now restart your dev server with:"
echo "  cd frontend && npm run dev"
