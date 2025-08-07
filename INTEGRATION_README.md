# Backend-Frontend Integration Guide

This document describes the complete integration between the Node.js backend API and React Native frontend application.

## 🏗️ Architecture Overview

The integration consists of:

- **Backend**: Node.js/Express API with SQLite database
- **Frontend**: React Native app with Expo
- **Authentication**: JWT-based authentication with token storage
- **Profile Management**: Complete CRUD operations for user profiles

## 📁 Project Structure

```
boilerplate/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Authentication & validation
│   │   ├── database/       # Database setup & migrations
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/               # React Native app
│   ├── src/
│   │   ├── services/       # API service layer
│   │   ├── contexts/       # Authentication context
│   │   ├── screens/        # UI screens
│   │   ├── config/         # API configuration
│   │   └── navigation/     # App navigation
│   └── package.json
└── INTEGRATION_README.md   # This file
```

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:3001`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start and you can run it on your device/simulator.

## 🔧 Configuration

### Backend Configuration

The backend uses environment variables. Copy `env.example` to `.env`:

```bash
cd backend
cp env.example .env
```

Key configuration options:
- `PORT`: Server port (default: 3001)
- `JWT_SECRET`: Secret for JWT tokens
- `CORS_ORIGIN`: Allowed origins for CORS

### Frontend Configuration

API configuration is in `frontend/src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};
```

**Important**: For production, change `BASE_URL` to your actual server URL.

## 🔐 Authentication Flow

### 1. Registration
- User fills registration form
- Frontend calls `/api/auth/register`
- Backend creates user and returns JWT token
- Token is stored in AsyncStorage
- User is redirected to profile creation

### 2. Login
- User enters credentials
- Frontend calls `/api/auth/login`
- Backend validates and returns JWT token
- Token is stored and user is authenticated

### 3. Profile Creation
- New users are prompted to create profile
- Profile data is sent to `/api/profile`
- User can now access the main app

### 4. Token Management
- Tokens are automatically included in API requests
- Tokens are stored securely in AsyncStorage
- Automatic token refresh and logout on expiration

## 📱 Frontend Features

### Authentication Context

The `AuthContext` provides:

```typescript
const { 
  user,           // Current user data
  profile,        // User profile data
  token,          // JWT token
  loading,        // Loading state
  login,          // Login function
  register,       // Register function
  logout,         // Logout function
  updateProfile,  // Update profile
  createProfile,  // Create new profile
  refreshProfile  // Refresh profile data
} = useAuth();
```

### API Service Layer

The `ProfileAPI` class handles all backend communication:

```typescript
const api = new ProfileAPI();

// Authentication
await api.register(username, email, password);
await api.login(username, password);
await api.getCurrentUser();

// Profile management
await api.createProfile(profileData);
await api.getProfile();
await api.updateProfile(profileData);
await api.searchProfiles(query);

// File upload
await api.uploadProfilePicture(imageUri);
```

### Navigation Flow

1. **Unauthenticated**: Shows login screen
2. **Authenticated without profile**: Shows profile creation screen
3. **Authenticated with profile**: Shows main app with tabs

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile Management
- `POST /api/profile` - Create profile
- `GET /api/profile/me` - Get own profile
- `PUT /api/profile/me` - Update profile
- `GET /api/profile/search` - Search profiles

### File Upload
- `POST /api/upload/profile-picture` - Upload profile picture

## 🔒 Security Features

### Backend Security
- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers

### Frontend Security
- Secure token storage in AsyncStorage
- Automatic token inclusion in requests
- Input validation
- Error handling and user feedback

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Profiles Table
```sql
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  location TEXT,
  interests TEXT,
  skills TEXT,
  experience TEXT,
  education TEXT,
  social TEXT,
  projects TEXT,
  profile_picture TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🧪 Testing

### API Testing
Run the integration test:

```bash
cd frontend
node test-integration.js
```

This will test:
- Health check
- API info
- User registration
- Profile creation

### Manual Testing
1. Start both backend and frontend
2. Register a new user
3. Create a profile
4. Test profile editing
5. Test logout and re-login

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS configuration includes frontend URL
   - Check `CORS_ORIGIN` in backend `.env`

2. **Authentication Failures**
   - Verify JWT_SECRET is set in backend
   - Check token storage in frontend
   - Ensure password meets requirements (uppercase, lowercase, number, special char)

3. **Database Issues**
   - Run `npm run migrate` in backend directory
   - Check database file permissions
   - Verify SQLite is installed

4. **Network Issues**
   - Ensure backend is running on correct port
   - Check firewall settings
   - Verify API_BASE_URL in frontend config

### Debug Mode

Enable debug logging in backend:

```bash
DEBUG=* npm run dev
```

## 📈 Performance Considerations

### Backend
- Database indexing on frequently queried fields
- Rate limiting to prevent abuse
- Image compression for uploads
- Connection pooling for database

### Frontend
- Lazy loading of screens
- Image caching
- Optimistic updates for better UX
- Error boundaries for crash prevention

## 🔄 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Set up reverse proxy (nginx)
4. Configure SSL certificates
5. Set up database backups

### Frontend Deployment
1. Update API_BASE_URL to production URL
2. Build for target platforms
3. Deploy to app stores or web hosting
4. Configure deep linking

## 📚 Additional Resources

- [Backend API Documentation](./backend/README.md)
- [Frontend Development Guide](./frontend/README.md)
- [Frontend Integration Guide](./backend/frontend-integration-guide.md)

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Ensure security best practices
5. Test on multiple devices/platforms

---

**Note**: This integration provides a solid foundation for a full-stack mobile application. The modular architecture allows for easy extension and maintenance. 