// Frontend Integration Example for React Native
// This file shows how to integrate the backend API with your React Native frontend

const API_BASE = 'http://localhost:3001/api';

// API Service Class
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

      // Store token for future requests
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

      // Store token for future requests
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

  async getProfileByUsername(username) {
    try {
      const response = await fetch(`${this.baseURL}/profile/username/${username}`, {
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

  // File Upload Methods
  async uploadProfilePicture(imageUri) {
    try {
      // Create form data for file upload
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

// Usage Examples for React Native

// 1. Initialize API service
const api = new ProfileAPI();

// 2. Authentication Example
async function handleLogin() {
  try {
    const result = await api.login('john_doe', 'SecurePass123!');
    console.log('Login successful:', result.user);
    
    // Store token in AsyncStorage for persistence
    // await AsyncStorage.setItem('authToken', result.token);
    
    return result;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
}

// 3. Profile Creation Example
async function handleCreateProfile() {
  try {
    const profileData = {
      name: 'John Doe',
      bio: 'Passionate developer, React Native enthusiast, and lover of clean UI.',
      location: 'Bangalore, India',
      interests: 'Coding, Music, Travel, Fitness',
      skills: 'JavaScript, TypeScript, React Native, Node.js, GraphQL, UI/UX Design',
      experience: '5+ years in mobile and web development. Built apps for startups and enterprises.',
      education: 'B.Tech in Computer Science, IIT Bombay',
      social_links: 'Twitter: @johndoe | GitHub: johndoe',
      projects: '- Fitness Tracker App\n- Travel Journal\n- Music Discovery Platform\n- Open Source UI Kit'
    };

    const result = await api.createProfile(profileData);
    console.log('Profile created:', result.profile);
    
    return result;
  } catch (error) {
    console.error('Profile creation failed:', error.message);
    throw error;
  }
}

// 4. Profile Update Example
async function handleUpdateProfile() {
  try {
    const updateData = {
      name: 'John Doe Updated',
      bio: 'Updated bio with new information'
    };

    const result = await api.updateProfile(updateData);
    console.log('Profile updated:', result.profile);
    
    return result;
  } catch (error) {
    console.error('Profile update failed:', error.message);
    throw error;
  }
}

// 5. Profile Search Example
async function handleSearchProfiles() {
  try {
    const result = await api.searchProfiles('react', 10, 0);
    console.log('Search results:', result.profiles);
    
    return result;
  } catch (error) {
    console.error('Profile search failed:', error.message);
    throw error;
  }
}

// 6. Image Upload Example
async function handleUploadProfilePicture(imageUri) {
  try {
    const result = await api.uploadProfilePicture(imageUri);
    console.log('Image uploaded:', result.imageUrl);
    
    // Update profile with new image URL
    await api.updateProfile({
      profile_picture: result.imageUrl
    });
    
    return result;
  } catch (error) {
    console.error('Image upload failed:', error.message);
    throw error;
  }
}

// React Native Component Example
/*
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await api.getProfile();
      setProfile(result.profile);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const result = await api.updateProfile({
        name: 'Updated Name',
        bio: 'Updated bio'
      });
      setProfile(result.profile);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Name: {profile?.name}</Text>
      <Text>Bio: {profile?.bio}</Text>
      <TouchableOpacity onPress={handleUpdateProfile}>
        <Text>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
*/

// Export the API service for use in React Native components
export default ProfileAPI; 