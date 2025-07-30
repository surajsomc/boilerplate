@echo off
REM Profile API Test UI Startup Script for Windows

echo 🎨 Starting Profile API Test UI...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Check if backend server is running
echo 🔍 Checking if backend server is running...
curl -s http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Backend server is not running on port 3001
    echo    Please start your backend server first:
    echo    cd .. && npm run dev
    echo.
) else (
    echo ✅ Backend server is running on port 3001
)

echo.
echo 🚀 Starting Test UI server on port 3002...
echo.

REM Start the server
npm start

pause 