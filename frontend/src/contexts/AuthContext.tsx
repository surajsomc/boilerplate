import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { User, Profile } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  createProfile: (profileData: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        api.setToken(storedToken);
        setToken(storedToken);
        const userData = await api.getCurrentUser();
        setUser(userData.user);
        
        // Try to load profile
        try {
          const profileData = await api.getProfile();
          setProfile(profileData.profile);
        } catch (error) {
          console.log('No profile found for user');
        }
      }
    } catch (error) {
      console.log('No stored auth found or error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await api.login(username, password);
      setUser(result.user);
      setToken(result.token);
      await AsyncStorage.setItem('authToken', result.token);
      
      // Try to load profile
      try {
        const profileData = await api.getProfile();
        setProfile(profileData.profile);
      } catch (error) {
        console.log('No profile found for user');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const result = await api.register(username, email, password);
      setUser(result.user);
      setToken(result.token);
      await AsyncStorage.setItem('authToken', result.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setProfile(null);
      setToken(null);
      api.clearToken();
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      const result = await api.updateProfile(profileData);
      setProfile(result.profile);
    } catch (error) {
      throw error;
    }
  };

  const createProfile = async (profileData: Partial<Profile>) => {
    try {
      const result = await api.createProfile(profileData);
      setProfile(result.profile);
    } catch (error) {
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      const profileData = await api.getProfile();
      setProfile(profileData.profile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
    createProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 