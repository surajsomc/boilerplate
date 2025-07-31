# Frontend Integration Guide

This guide shows you how to integrate the backend API with your React Native frontend.

## Step 1: Create API Service in Your Frontend

First, create a new file in your frontend project:

```bash
# In your frontend directory
mkdir -p src/services
touch src/services/api.js
```

## Step 2: Copy the API Service

Copy this code into `src/services/api.js`:

```javascript
const API_BASE = 'http://localhost:3001/api'; // Change this to your server URL

class ProfileAPI {
  constructor() {
    this.baseURL = API_BASE;
    this.token = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
  }

  // Get headers with authentication
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Authentication Methods
  async register(username, email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      this.setToken(data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      this.setToken(data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: this.getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get current user');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Profile Methods
  async createProfile(profileData) {
    try {
      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create profile');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await fetch(`${this.baseURL}/profile/me`, {
        headers: this.getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get profile');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await fetch(`${this.baseURL}/profile/me`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async searchProfiles(query, limit = 10, offset = 0) {
    try {
      const response = await fetch(
        `${this.baseURL}/profile/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
        {
          headers: this.getHeaders()
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to search profiles');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async uploadProfilePicture(imageUri) {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile-picture.jpg'
      });

      const response = await fetch(`${this.baseURL}/upload/profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default ProfileAPI;
```

## Step 3: Create Authentication Context

Create `src/contexts/AuthContext.js`:

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileAPI from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = new ProfileAPI();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        api.setToken(storedToken);
        const userData = await api.getCurrentUser();
        setUser(userData.user);
        setToken(storedToken);
      }
    } catch (error) {
      console.log('No stored auth found');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const result = await api.login(username, password);
      setUser(result.user);
      setToken(result.token);
      await AsyncStorage.setItem('authToken', result.token);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const result = await api.register(username, email, password);
      setUser(result.user);
      setToken(result.token);
      await AsyncStorage.setItem('authToken', result.token);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    api
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Step 4: Update Your App.js

Update your main App component to use the AuthProvider:

```javascript
import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator'; // Your existing navigation

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
```

## Step 5: Create Login Screen

Create `src/screens/LoginScreen.js`:

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      // Navigation will be handled by your app's navigation logic
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 10,
  },
});
```

## Step 6: Update Your Profile Screen

Update your existing `src/screens/profile.tsx` to use the API:

```typescript
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';

const PROFILE_PIC = 'https://randomuser.me/api/portraits/men/32.jpg'; // Default placeholder

export default function ProfileScreen() {
  const { colorScheme } = useColorScheme();
  const { api, user } = useAuth();
  const theme = NAV_THEME[colorScheme];
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await api.getProfile();
      setProfile(result.profile);
    } catch (error) {
      console.log('No profile found or error loading profile:', error.message);
      // Profile doesn't exist yet, that's okay
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const profileData = {
        name: 'Suraj Sharma',
        bio: 'Passionate developer, React Native enthusiast, and lover of clean UI. Always learning and building cool things.',
        location: 'Bangalore, India',
        interests: 'Coding, Music, Travel, Fitness',
        skills: 'JavaScript, TypeScript, React Native, Node.js, GraphQL, UI/UX Design',
        experience: '5+ years in mobile and web development. Built apps for startups and enterprises.',
        education: 'B.Tech in Computer Science, IIT Bombay',
        social_links: 'Twitter: @surajcodes | GitHub: surajsharma',
        projects: '- Fitness Tracker App\n- Travel Journal\n- Music Discovery Platform\n- Open Source UI Kit'
      };

      const result = await api.createProfile(profileData);
      setProfile(result.profile);
      Alert.alert('Success', 'Profile created successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: 128, backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.profilePicContainer}>
        <Image 
          source={{ uri: profile?.profile_picture || PROFILE_PIC }} 
          style={[styles.profilePic, { backgroundColor: colorScheme === 'dark' ? '#27272a' : '#e5e7eb', borderColor: theme.card }]} 
        />
      </View>
      
      <Text style={[styles.name, { color: theme.text }]}>
        {profile?.name || 'Suraj Sharma'}
      </Text>
      
      <Text style={[styles.email, { color: colorScheme === 'dark' ? '#d4d4d8' : '#52525b' }]}>
        {user?.email || 'suraj@example.com'}
      </Text>

      {!profile && (
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: '#007AFF' }]}
          onPress={createProfile}
        >
          <Text style={styles.createButtonText}>Create Profile</Text>
        </TouchableOpacity>
      )}

      {profile && (
        <>
          <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Bio</Text>
            <Text style={[styles.infoText, { color: theme.text }]}>
              {profile.bio || 'No bio available'}
            </Text>
          </View>

          <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Location</Text>
            <Text style={[styles.infoText, { color: theme.text }]}>
              {profile.location || 'Location not set'}
            </Text>
          </View>

          <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Interests</Text>
            <Text style={[styles.infoText, { color: theme.text }]}>
              {profile.interests || 'No interests listed'}
            </Text>
          </View>

          <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Skills</Text>
            <Text style={[styles.infoText, { color: theme.text }]}>
              {profile.skills || 'No skills listed'}
            </Text>
          </View>

          <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Experience</Text>
            <Text style={[styles.infoText, { color: theme.text }]}>
              {profile.experience || 'No experience listed'}
            </Text>
          </View>

          <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Education</Text>
            <Text style={[styles.infoText, { color: theme.text }]}>
              {profile.education || 'No education listed'}
            </Text>
          </View>

          <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Social</Text>
            <Text style={[styles.infoText, { color: theme.text }]}>
              {profile.social_links || 'No social links'}
            </Text>
          </View>

          <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
            <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Projects</Text>
            <Text style={[styles.infoText, { color: theme.text }]}>
              {profile.projects || 'No projects listed'}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profilePicContainer: {
    marginBottom: 18,
    borderRadius: 64,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  profilePic: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#e5e7eb',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#d4d4d8',
    fontFamily: 'Poppins-Regular',
    marginBottom: 18,
    textAlign: 'center',
  },
  infoSection: {
    width: '100%',
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 15,
    color: '#a1a1aa',
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
});
```

## Step 7: Install Required Dependencies

Add these to your frontend's `package.json`:

```bash
npm install @react-native-async-storage/async-storage
```

## Step 8: Update API Base URL

Make sure to update the `API_BASE` URL in `src/services/api.js` to match your backend server:

```javascript
// For local development
const API_BASE = 'http://localhost:3001/api';

// For Android emulator
// const API_BASE = 'http://10.0.2.2:3001/api';

// For physical device (replace with your computer's IP)
// const API_BASE = 'http://192.168.1.100:3001/api';
```

## Step 9: Test the Integration

1. **Start your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start your React Native app:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the flow:**
   - Register a new user
   - Login with the user
   - Create a profile
   - View the profile data

## Common Issues and Solutions

### 1. Network Error
If you get network errors, make sure:
- Backend server is running on the correct port
- API_BASE URL is correct for your setup
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For physical devices, use your computer's IP address

### 2. CORS Issues
The backend is already configured with CORS, but if you have issues:
- Check the `CORS_ORIGIN` in your backend `.env` file
- Make sure it matches your frontend URL

### 3. Authentication Issues
- Make sure the JWT token is being stored properly
- Check that the token is being sent in request headers
- Verify the token hasn't expired

## Next Steps

1. **Add Profile Editing**: Create an edit profile screen
2. **Add Image Upload**: Implement profile picture upload
3. **Add Profile Search**: Create a search screen
4. **Add Error Handling**: Improve error messages and loading states
5. **Add Offline Support**: Implement offline data caching

This integration gives you a complete authentication and profile management system that works seamlessly with your existing React Native frontend! 