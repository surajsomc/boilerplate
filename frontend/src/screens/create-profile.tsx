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
  Dimensions,
} from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME, COLORS } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';
import { Profile } from '../services/api';

const { width } = Dimensions.get('window');

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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.text }]}>
              Create Your Profile
            </Text>
            
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Tell us a bit about yourself to personalize your experience
            </Text>
          </View>

          {/* Required Fields Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Basic Information</Text>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
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

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
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
          </View>

          {/* Optional Fields Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Additional Information</Text>
            
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
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleCreateProfile}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={[styles.primaryButtonText, { color: theme.background }]}>
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSkip}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>
                Skip for now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={[styles.logoutText, { color: theme.error }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 80,
    paddingBottom: 50,
  },
  form: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  headerSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.2,
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textArea: {
    height: 100,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'top',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionSection: {
    marginTop: 20,
  },
  primaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
}); 