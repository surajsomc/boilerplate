# Profile Backend API

A comprehensive Node.js/Express backend API for user profile creation and management, designed to work with your React Native frontend.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone and navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   DB_PATH=./database/profiles.db
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001` (or your configured PORT).

## 🧪 Testing the API

### Option 1: Web-based Test UI (Recommended)

1. **Start the test UI server:**
   ```bash
   cd test-ui
   npm install
   npm start
   ```

2. **Open in browser:**
   Navigate to `http://localhost:3002`

3. **Test all endpoints:**
   - Register and login users
   - Create and manage profiles
   - Upload profile pictures
   - Search profiles

### Option 2: Automated Test Script

```bash
# Run the automated test script
node test-api.js
```

### Option 3: Manual Testing with curl

```bash
# Health check
curl http://localhost:3001/health

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

## 🔧 Features

- 🔐 **User Authentication**: JWT-based authentication with secure password hashing
- 👤 **Profile Management**: Complete CRUD operations for user profiles
- 🖼️ **Image Upload**: Profile picture upload with automatic resizing
- 🔍 **Profile Search**: Search profiles by name, bio, skills, or interests
- ✅ **Input Validation**: Comprehensive request validation using Joi
- 🛡️ **Security**: Rate limiting, CORS, and security headers
- 📊 **SQLite Database**: Lightweight, file-based database for easy deployment
- 🧪 **Testing Tools**: Web-based test UI and automated test scripts
- 📚 **Documentation**: Comprehensive API documentation and examples

## 🌐 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Profile Management

#### Create Profile
```http
POST /api/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Doe",
  "bio": "Passionate developer, React Native enthusiast, and lover of clean UI.",
  "location": "Bangalore, India",
  "interests": "Coding, Music, Travel, Fitness",
  "skills": "JavaScript, TypeScript, React Native, Node.js, GraphQL, UI/UX Design",
  "experience": "5+ years in mobile and web development. Built apps for startups and enterprises.",
  "education": "B.Tech in Computer Science, IIT Bombay",
  "social_links": "Twitter: @johndoe | GitHub: johndoe",
  "projects": "- Fitness Tracker App\n- Travel Journal\n- Music Discovery Platform\n- Open Source UI Kit"
}
```

#### Get Own Profile
```http
GET /api/profile/me
Authorization: Bearer <jwt_token>
```

#### Get Profile by User ID
```http
GET /api/profile/user/:userId
```

#### Get Profile by Username
```http
GET /api/profile/username/:username
```

#### Update Profile
```http
PUT /api/profile/me
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "bio": "Updated bio information"
}
```

#### Update Profile Picture
```http
PATCH /api/profile/me/picture
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "profile_picture": "http://localhost:3001/uploads/profile_uuid_filename.jpg"
}
```

#### Delete Profile
```http
DELETE /api/profile/me
Authorization: Bearer <jwt_token>
```

#### Search Profiles
```http
GET /api/profile/search?q=react&limit=10&offset=0
```

### File Upload

#### Upload Profile Picture
```http
POST /api/upload/profile-picture
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

Form Data:
- image: [file]
```

**Response:**
```json
{
  "message": "Profile picture uploaded successfully",
  "imageUrl": "http://localhost:3001/uploads/profile_uuid_filename.jpg",
  "filename": "profile_uuid_filename.jpg"
}
```

#### Delete Uploaded File
```http
DELETE /api/upload/profile-picture/:filename
Authorization: Bearer <jwt_token>
```

## 📊 Profile Data Structure

The profile object contains the following fields:

```json
{
  "id": "profile_uuid",
  "user_id": "user_uuid",
  "name": "John Doe",
  "bio": "Passionate developer...",
  "location": "Bangalore, India",
  "interests": "Coding, Music, Travel, Fitness",
  "skills": "JavaScript, TypeScript, React Native...",
  "experience": "5+ years in mobile and web development...",
  "education": "B.Tech in Computer Science, IIT Bombay",
  "social_links": "Twitter: @johndoe | GitHub: johndoe",
  "projects": "- Fitness Tracker App\n- Travel Journal...",
  "profile_picture": "http://localhost:3001/uploads/profile.jpg",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## ⚠️ Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with 12 salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js for security headers
- **File Upload Security**: File type and size validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization and output encoding

## 🗄️ Database Schema

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
  user_id TEXT NOT NULL,
  name TEXT,
  bio TEXT,
  location TEXT,
  interests TEXT,
  skills TEXT,
  experience TEXT,
  education TEXT,
  social_links TEXT,
  projects TEXT,
  profile_picture TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3001` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `JWT_SECRET` | JWT signing secret | - | **Yes** |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` | No |
| `DB_PATH` | Database file path | `./database/profiles.db` | No |
| `UPLOAD_PATH` | Upload directory | `./uploads` | No |
| `MAX_FILE_SIZE` | Max file upload size | `5242880` (5MB) | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15min) | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | No |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` | No |

## 🛠️ Development

### Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Run database migrations
npm run migrate
```

### Project Structure

```
backend/
├── src/
│   ├── database/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── validation.js        # Request validation
│   │   ├── errorHandler.js      # Error handling
│   │   └── notFound.js          # 404 handler
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── profile.js           # Profile management routes
│   │   └── upload.js            # File upload routes
│   └── server.js                # Main server file
├── test-ui/                     # Web-based API testing interface
├── database/                    # SQLite database files
├── uploads/                     # Uploaded files
├── package.json
├── env.example
├── test-api.js                  # Automated test script
├── frontend-integration-guide.md # Frontend integration guide
└── README.md
```

## 🔗 Integration with Frontend

To integrate with your React Native frontend:

1. **Update API base URL** in your frontend configuration
2. **Implement authentication flow** using the `/api/auth` endpoints
3. **Use profile endpoints** to manage user profiles
4. **Handle file uploads** for profile pictures

Example frontend API call:
```javascript
const API_BASE = 'http://localhost:3001/api';

// Login
const response = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'SecurePass123!'
  })
});

const { token } = await response.json();

// Get profile with token
const profileResponse = await fetch(`${API_BASE}/profile/me`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

For detailed frontend integration, see [Frontend Integration Guide](./frontend-integration-guide.md).

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set proper production values
2. **JWT Secret**: Use a strong, unique secret
3. **Database**: Consider using PostgreSQL for production
4. **File Storage**: Use cloud storage (AWS S3, etc.) for uploads
5. **HTTPS**: Enable SSL/TLS
6. **Monitoring**: Add logging and monitoring
7. **Backup**: Regular database backups
8. **Load Balancing**: For high-traffic applications
9. **CDN**: For static file delivery

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup for Production

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-production-secret
JWT_EXPIRES_IN=7d
DB_PATH=/app/database/profiles.db
UPLOAD_PATH=/app/uploads
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://yourdomain.com
```

## 🐛 Troubleshooting

### Common Issues

#### Database Issues
```bash
# Check database file permissions
ls -la database/

# Reset database (WARNING: deletes all data)
rm database/profiles.db
npm run dev
```

#### File Upload Issues
```bash
# Check upload directory permissions
ls -la uploads/

# Create upload directory if missing
mkdir -p uploads
chmod 755 uploads
```

#### CORS Issues
- Ensure CORS_ORIGIN includes your frontend URL
- Check browser console for CORS errors
- Verify frontend is making requests to correct backend URL

#### Authentication Issues
- Verify JWT_SECRET is set correctly
- Check token expiration settings
- Ensure tokens are being sent in Authorization header

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
```

### Health Check

Test server health:
```bash
curl http://localhost:3001/health
```

## 📚 Additional Resources

### Documentation
- [Frontend Integration Guide](./frontend-integration-guide.md)
- [Test UI Documentation](./test-ui/README.md)
- [API Testing Guide](./test-api.js)

### External Resources
- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Multer Documentation](https://github.com/expressjs/multer)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this in your projects!

## 🆘 Support

For issues and questions:
1. Check the error logs
2. Verify environment variables
3. Ensure database permissions
4. Check file upload directory permissions
5. Use the test UI to verify API functionality
6. Check the troubleshooting section above 