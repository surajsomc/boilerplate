import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';
import { Profile } from '../services/api';

const DEFAULT_PROFILE_PIC = 'https://randomuser.me/api/portraits/men/32.jpg';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Profile>>({});
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme];
  const { user, profile, updateProfile } = useAuth();

  useEffect(() => {
    if (profile) {
      setEditData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        interests: profile.interests || '',
        skills: profile.skills || '',
        experience: profile.experience || '',
        education: profile.education || '',
        social: profile.social || '',
        projects: profile.projects || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setShowEditModal(false);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const renderInfoSection = (label: string, value: string, key: keyof Profile) => {
    if (isEditing) {
      return (
        <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
          <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>{label}</Text>
          <TextInput
            style={[styles.editInput, { color: theme.text, backgroundColor: theme.card }]}
            value={editData[key] as string}
            onChangeText={(text) => setEditData(prev => ({ ...prev, [key]: text }))}
            multiline
            placeholder={`Enter your ${label.toLowerCase()}`}
            placeholderTextColor={theme.textSecondary}
          />
        </View>
      );
    }

    return (
      <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>{label}</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>
          {value || `No ${label.toLowerCase()} added yet`}
        </Text>
      </View>
    );
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.name, { color: theme.text }]}>Please login to view your profile</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 128, backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        <View style={styles.profilePicContainer}>
          <Image 
            source={{ uri: profile?.profilePicture || DEFAULT_PROFILE_PIC }} 
            style={[styles.profilePic, { backgroundColor: colorScheme === 'dark' ? '#27272a' : '#e5e7eb', borderColor: theme.card }]} 
          />
        </View>

        <Text style={[styles.name, { color: theme.text }]}>
          {profile?.firstName && profile?.lastName 
            ? `${profile.firstName} ${profile.lastName}`
            : user.username
          }
        </Text>

        {profile?.bio && (
          <Text style={[styles.bio, { color: theme.textSecondary }]}>
            {profile.bio}
          </Text>
        )}

        <View style={styles.infoContainer}>
          {renderInfoSection('Location', profile?.location || '', 'location')}
          {renderInfoSection('Interests', profile?.interests || '', 'interests')}
          {renderInfoSection('Skills', profile?.skills || '', 'skills')}
          {renderInfoSection('Experience', profile?.experience || '', 'experience')}
          {renderInfoSection('Education', profile?.education || '', 'education')}
          {renderInfoSection('Social', profile?.social || '', 'social')}
          {renderInfoSection('Projects', profile?.projects || '', 'projects')}
        </View>

        <View style={styles.buttonContainer}>
          {!isEditing ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'transparent', borderColor: theme.border }]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Modal for better UX on smaller screens */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={[styles.modalClose, { color: theme.primary }]}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {Object.entries(editData).map(([key, value]) => (
              <View key={key} style={styles.modalInputContainer}>
                <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <TextInput
                  style={[styles.modalInput, { 
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border
                  }]}
                  value={value as string}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, [key]: text }))}
                  multiline
                  placeholder={`Enter your ${key}`}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  editInput: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  modalClose: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalInputContainer: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  modalInput: {
    height: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'top',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  bio: {
    fontSize: 16,
    marginBottom: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 18,
  },
});