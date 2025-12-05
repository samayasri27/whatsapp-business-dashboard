#!/bin/bash

echo "🚀 Starting WhatsApp Business Dashboard..."
echo ""

# Check if .env files exist
if [ ! -f "whatsapp-backend/.env" ]; then
    echo "⚠️  Backend .env file not found!"
    echo "Creating from .env.example..."
    cp whatsapp-backend/.env.example whatsapp-backend/.env
    echo "✅ Please edit whatsapp-backend/.env with your credentials"
fi

if [ ! -f "whatsapp-business-ui/.env.local" ]; then
    echo "⚠️  Frontend .env.local file not found!"
    echo "Creating from .env.example..."
    cp whatsapp-business-ui/.env.example whatsapp-business-ui/.env.local
    echo "✅ Please edit whatsapp-business-ui/.env.local with your credentials"
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd whatsapp-backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd whatsapp-business-ui
npm install
cd ..

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "🎯 Starting services..."
echo ""

# Start backend in background
echo "Starting backend on http://localhost:8000..."
cd whatsapp-backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend on http://localhost:3000..."
cd whatsapp-business-ui
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services started!"
echo ""
echo "📍 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
