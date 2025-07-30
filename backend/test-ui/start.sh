#!/bin/bash

# Profile API Test UI Startup Script

echo "🎨 Starting Profile API Test UI..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if backend server is running
echo "🔍 Checking if backend server is running..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend server is running on port 3001"
else
    echo "⚠️  Backend server is not running on port 3001"
    echo "   Please start your backend server first:"
    echo "   cd ../ && npm run dev"
    echo ""
fi

echo ""
echo "🚀 Starting Test UI server on port 3002..."
echo ""

# Start the server
npm start 