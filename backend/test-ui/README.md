# Profile API Test UI

A beautiful, interactive web interface for testing your Profile API backend endpoints, now hosted on a dedicated server!

## 🚀 Quick Start

### Option 1: Using the Startup Scripts (Recommended)

**On Linux/macOS:**
```bash
cd backend/test-ui
./start.sh
```

**On Windows:**
```bash
cd backend/test-ui
start.bat
```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   cd backend/test-ui
   npm install
   ```

2. **Start the test UI server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3002`

### Option 3: Development Mode

For development with auto-reload:
```bash
cd backend/test-ui
npm run dev
```

## 📊 Server Information

- **Test UI Server**: `http://localhost:3002`
- **Backend API Server**: `http://localhost:3001`
- **Health Check**: `http://localhost:3002/health`

## ✨ Features

### 🔐 Authentication Testing
- **User Registration**: Test user signup with validation
- **User Login**: Test authentication with username/email
- **Current User**: Get logged-in user information
- **Logout**: Clear authentication state

### 👤 Profile Management
- **Create Profile**: Add all profile fields
- **Get Profile**: Retrieve current user's profile
- **Update Profile**: Modify existing profile data
- **Delete Profile**: Remove profile (with confirmation)
- **Search Profiles**: Find profiles by query

### 📁 File Upload
- **Profile Picture Upload**: Test image upload functionality
- **File Validation**: Automatic file type checking

### 📊 Real-time Monitoring
- **Server Status**: Live connection status indicator
- **Authentication Status**: Current login state
- **Response Logging**: Detailed API response history
- **Error Handling**: Clear error messages and notifications

## 🎯 How to Use

### 1. Start Both Servers

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Test UI:**
```bash
cd backend/test-ui
npm start
```

### 2. Access the Test UI

Open your browser and go to: `http://localhost:3002`

### 3. Test Your API

1. **Check Server Status**: The UI automatically checks if your backend is running
2. **Register a User**: Create a new account
3. **Login**: Authenticate with your credentials
4. **Create Profile**: Add profile information
5. **Test All Endpoints**: Use the interface to test every API endpoint

## 🔧 Configuration

### Environment Variables

You can customize the test UI server port:

```bash
# Set custom port (default: 3002)
export TEST_UI_PORT=3003
npm start
```

### API Base URL

The test UI connects to your backend API at `http://localhost:3001/api`. If your backend runs on a different port, update the `baseURL` in `script.js`:

```javascript
this.baseURL = 'http://localhost:YOUR_PORT/api';
```

## 📱 Responsive Design

The test UI is fully responsive and works on:
- Desktop browsers
- Tablet devices
- Mobile phones
- Different screen sizes

## 🎨 UI Features

- **Modern Design**: Clean, professional interface
- **Real-time Status**: Live server and auth status
- **Form Validation**: Client-side input validation
- **Success/Error Notifications**: Toast-style notifications
- **Response Logging**: Detailed API call history
- **Confirmation Dialogs**: Safe deletion with confirmation
- **Loading States**: Visual feedback during API calls

## 🐛 Troubleshooting

### Test UI Server Issues
- **Port already in use**: Change the port using `TEST_UI_PORT` environment variable
- **Dependencies missing**: Run `npm install` in the test-ui directory
- **Node.js not found**: Install Node.js (version 16 or higher)

### Backend Connection Issues
- **Backend not running**: Start your backend server first (`cd backend && npm run dev`)
- **Wrong port**: Make sure backend is running on port 3001
- **CORS errors**: Backend is already configured for CORS

### Browser Issues
- **Page not loading**: Check if the test UI server is running on port 3002
- **API calls failing**: Check browser console for error messages
- **Authentication issues**: Clear browser localStorage

## 📋 Test Scenarios

### Complete User Flow
1. Register a new user
2. Login with the user
3. Create a profile with all fields
4. Upload a profile picture
5. Update some profile fields
6. Search for profiles
7. Get your profile to verify changes
8. Logout

### Error Testing
1. Try to register with existing username/email
2. Login with wrong credentials
3. Access protected endpoints without authentication
4. Upload non-image files
5. Submit forms with invalid data

### Performance Testing
1. Make multiple rapid API calls
2. Test with large profile data
3. Upload large image files
4. Search with various query terms

## 🔗 Integration with Frontend

This test UI helps you verify that your backend API works correctly before integrating with your React Native frontend. Once you've tested all endpoints here, you can confidently implement the frontend integration using the provided `frontend-integration-guide.md`.

## 📝 Notes

- The test UI stores authentication tokens in browser localStorage
- All API responses are logged for debugging
- The interface automatically handles authentication headers
- File uploads use FormData for proper multipart requests
- The UI provides immediate feedback for all operations
- The server includes CORS support for cross-origin requests

## 🚀 Quick Commands

```bash
# Start everything with one command (Linux/macOS)
cd backend && npm run dev & cd test-ui && npm start

# Start everything with one command (Windows)
cd backend && start npm run dev && cd test-ui && npm start

# Development mode with auto-reload
cd backend/test-ui && npm run dev
```

Happy testing! 🎉 