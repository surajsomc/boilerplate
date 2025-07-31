# Profile Management System

A complete full-stack profile management system with a React Native frontend and Node.js backend, featuring user authentication, profile management, and file uploads.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (for frontend development)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd boilerplate
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Backend setup
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

5. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Test the API (Optional):**
   ```bash
   cd backend/test-ui
   npm install
   npm start
   # Open http://localhost:3002 in your browser
   ```

## 📁 Project Structure

```
boilerplate/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── database/       # Database configuration
│   │   └── server.js       # Main server file
│   ├── test-ui/           # Web-based API testing interface
│   ├── uploads/           # File upload storage
│   ├── database/          # SQLite database files
│   └── README.md          # Backend documentation
├── frontend/              # React Native app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/          # Utility functions
│   │   └── types/        # TypeScript types
│   └── README.md         # Frontend documentation
└── README.md             # This file
```

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT tokens
- **File Uploads**: Multer + Sharp
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate limiting

### Frontend (React Native + Expo)
- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Custom bottom navigation
- **State Management**: React Context
- **TypeScript**: Full type safety

## 🔧 Features

### Authentication
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Session management

### Profile Management
- Create, read, update, delete profiles
- Profile picture uploads
- Profile search functionality
- Rich profile data (bio, skills, experience, etc.)

### File Uploads
- Image upload with validation
- Automatic image resizing and compression
- Secure file storage
- File type and size restrictions

### Security
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Profiles
- `POST /api/profile` - Create profile
- `GET /api/profile/me` - Get own profile
- `PUT /api/profile/me` - Update profile
- `DELETE /api/profile/me` - Delete profile
- `GET /api/profile/search` - Search profiles

### File Uploads
- `POST /api/upload/profile-picture` - Upload profile picture
- `GET /api/upload/files` - List uploaded files
- `DELETE /api/upload/files/:filename` - Delete file

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### API Testing UI
```bash
cd backend/test-ui
npm start
# Open http://localhost:3002
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📱 Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm run start        # Start production server
npm test            # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start Expo development server
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run on web
```

## 🔒 Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
DB_PATH=./database/profiles.db
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Deployment

### Backend Deployment
1. Set up production environment variables
2. Build the application
3. Deploy to your preferred hosting service
4. Set up database and file storage

### Frontend Deployment
1. Build the app for production
2. Deploy to app stores or web
3. Update API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Backend Issues**: Check `backend/README.md`
- **Frontend Issues**: Check `frontend/README.md`
- **API Testing**: Use the test UI at `http://localhost:3002`

## 🔗 Quick Links

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [API Testing UI](./backend/test-ui/README.md)
- [Frontend Integration Guide](./backend/frontend-integration-guide.md)