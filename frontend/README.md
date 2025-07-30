# React Native Profile App

A modern React Native application built with Expo and NativeWind, featuring profile management, authentication, and seamless backend integration.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Expo Go app** (for mobile testing)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Run on specific platforms:**
   ```bash
   npm run android    # Android
   npm run ios        # iOS (macOS only)
   npm run web        # Web browser
   ```

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Custom bottom navigation
- **State Management**: React Context API
- **Icons**: Lucide React Native
- **Backend Integration**: RESTful API with JWT authentication

### Project Structure
```
src/
├── screens/              # App screens
│   ├── home.tsx         # Home screen with navigation
│   ├── profile.tsx      # Profile management screen
│   ├── chat.tsx         # Chat interface
│   └── calendar.tsx     # Calendar page
├── components/          # Reusable components
│   ├── error-boundary.tsx
│   └── navigation/
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utility functions
│   ├── useColorScheme.ts
│   └── constants.ts
├── types/             # TypeScript type definitions
│   └── types.ts
└── _layout.tsx        # Root layout configuration
```

## 🔧 Features

### Core Features
- **Profile Management**: Create, view, and edit user profiles
- **Authentication**: Secure login and registration
- **File Uploads**: Profile picture upload functionality
- **Responsive Design**: Works on mobile, tablet, and web
- **Dark/Light Mode**: Automatic theme switching
- **Offline Support**: Basic offline functionality

### UI/UX Features
- **Modern Design**: Clean, professional interface
- **Smooth Animations**: Custom animated components
- **Accessibility**: Full accessibility support
- **Performance**: Optimized with React.memo and hooks
- **Error Handling**: Graceful error boundaries

### Backend Integration
- **RESTful API**: Complete backend integration
- **JWT Authentication**: Secure token-based auth
- **Real-time Updates**: Live profile data synchronization
- **File Upload**: Image upload with progress tracking

## 🔐 Authentication

The app uses JWT-based authentication with the backend API:

### Authentication Flow
1. **Registration**: Create new user account
2. **Login**: Authenticate with credentials
3. **Token Storage**: Secure token persistence
4. **Auto-login**: Automatic session restoration
5. **Logout**: Clear session and tokens

### AuthContext Usage
```typescript
import { useAuth } from '../contexts/AuthContext';

const { user, login, logout, register } = useAuth();
```

## 📱 Screens

### Home Screen (`home.tsx`)
- Feature grid with navigation
- Quick access to main functions
- Responsive layout for all devices

### Profile Screen (`profile.tsx`)
- **Profile Display**: Show user profile information
- **Profile Creation**: Create new profile if none exists
- **Profile Editing**: Update profile data
- **Image Upload**: Upload profile pictures
- **Backend Integration**: Real-time data sync

### Chat Screen (`chat.tsx`)
- Chat interface (placeholder for future features)
- Message display and input
- User list and conversations

### Calendar Screen (`calendar.tsx`)
- Calendar view (placeholder for future features)
- Event management
- Schedule display

## 🎨 Styling

### NativeWind (Tailwind CSS)
The app uses NativeWind for consistent styling:

```typescript
// Example styling
<View className="flex-1 bg-white dark:bg-gray-900">
  <Text className="text-lg font-bold text-gray-900 dark:text-white">
    Hello World
  </Text>
</View>
```

### Theme Support
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes
- **Auto-switching**: Follows system preferences
- **Custom Colors**: Branded color scheme

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced layouts for tablets
- **Web Support**: Full web browser compatibility
- **Cross-platform**: Consistent experience across platforms

## 🔧 Development

### Development Commands
```bash
npm run dev          # Start development server
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run web          # Run on web
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Error Boundaries**: Graceful error handling
- **Performance**: Optimized with React hooks

### Best Practices
- **Component Architecture**: Modular, reusable components
- **Type Safety**: Full TypeScript integration
- **Error Handling**: Comprehensive error boundaries
- **Accessibility**: ARIA labels and screen reader support
- **Performance**: Optimized re-renders and memory usage

## 🔗 Backend Integration

### API Configuration
The app connects to the backend API for:
- User authentication
- Profile management
- File uploads
- Data synchronization

### API Service
```typescript
// Example API usage
const api = {
  login: async (credentials) => { /* ... */ },
  register: async (userData) => { /* ... */ },
  getProfile: async () => { /* ... */ },
  updateProfile: async (data) => { /* ... */ },
  uploadImage: async (file) => { /* ... */ }
};
```

### Environment Setup
Configure the API endpoint in your environment:
```typescript
// Update API base URL for your backend
const API_BASE_URL = 'http://localhost:3001/api';
```

## 🧪 Testing

### Testing Commands
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user flow testing
- **Accessibility Tests**: Screen reader compatibility

## 📦 Building & Deployment

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build:prod
```

### Platform-Specific Builds
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios

# Web
npx expo build:web
```

## 🐛 Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear Metro cache
npx expo start --clear

# Reset cache
npx expo start -c
```

#### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Check TypeScript
npx tsc --noEmit

# Fix type issues
npm run type-check
```

#### Backend Connection Issues
- Ensure backend server is running on port 3001
- Check CORS configuration in backend
- Verify API endpoints are accessible
- Check network connectivity

### Performance Issues
- Use React.memo for expensive components
- Implement proper dependency arrays in hooks
- Optimize image loading and caching
- Monitor bundle size and loading times

## 🔒 Security

### Best Practices
- **Token Storage**: Secure token persistence
- **Input Validation**: Client-side validation
- **Error Handling**: Secure error messages
- **Network Security**: HTTPS for production
- **Data Protection**: Secure data transmission

### Authentication Security
- JWT token validation
- Secure token storage
- Automatic token refresh
- Session management
- Logout functionality

## 📚 Additional Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

### Backend Integration
- [Backend README](../backend/README.md)
- [API Documentation](../backend/README.md#api-endpoints)
- [Frontend Integration Guide](../backend/frontend-integration-guide.md)

### Development Tools
- [Expo DevTools](https://docs.expo.dev/develop/tools/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check this README and linked resources
- **Issues**: Create an issue in the repository
- **Backend Issues**: Check [Backend README](../backend/README.md)
- **Expo Issues**: Check [Expo Documentation](https://docs.expo.dev/)
