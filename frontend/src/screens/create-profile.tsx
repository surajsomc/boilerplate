import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';
import { Profile } from '../services/api';

export default function CreateProfileScreen() {
  const [profileData, setProfileData] = useState<Partial<Profile>>({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    interests: '',
    skills: '',
    experience: '',
    education: '',
    social: '',
    projects: '',
  });
  const [loading, setLoading] = useState(false);
  
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme];
  const { createProfile, logout } = useAuth();

  const handleCreateProfile = async () => {
    if (!profileData.firstName?.trim() || !profileData.lastName?.trim()) {
      Alert.alert('Error', 'Please enter your first and last name');
      return;
    }

    setLoading(true);
    try {
      await createProfile(profileData);
      Alert.alert('Success', 'Profile created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      // Create a minimal profile with just the required fields
      await createProfile({
        firstName: 'User',
        lastName: 'Profile',
      });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const updateField = (field: keyof Profile, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={[styles.title, { color: theme.text }]}>
            Create Your Profile
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Tell us a bit about yourself to get started
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>First Name *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={profileData.firstName}
              onChangeText={(text) => updateField('firstName', text)}
              placeholder="Enter your first name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Last Name *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={profileData.lastName}
              onChangeText={(text) => updateField('lastName', text)}
              placeholder="Enter your last name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Bio</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={profileData.bio}
              onChangeText={(text) => updateField('bio', text)}
              placeholder="Tell us about yourself..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Location</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={profileData.location}
              onChangeText={(text) => updateField('location', text)}
              placeholder="Where are you located?"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Interests</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={profileData.interests}
              onChangeText={(text) => updateField('interests', text)}
              placeholder="What are your interests?"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Skills</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.border
              }]}
              value={profileData.skills}
              onChangeText={(text) => updateField('skills', text)}
              placeholder="What are your skills?"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={2}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleCreateProfile}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={loading}
          >
            <Text style={[styles.skipText, { color: theme.textSecondary }]}>
              Skip for now
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={loading}
          >
            <Text style={[styles.logoutText, { color: theme.textSecondary }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 50,
  },
  form: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Poppins-Regular',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  textArea: {
    height: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'top',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
}); 