import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, Dimensions } from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME, COLORS } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';
import { Profile } from '../services/api';

const { width } = Dimensions.get('window');
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
        <View style={[styles.infoSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
          <TextInput
            style={[styles.editInput, { color: theme.text, backgroundColor: theme.background }]}
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
      <View style={[styles.infoSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
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
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profilePicContainer}>
            <Image 
              source={{ uri: profile?.profilePicture || DEFAULT_PROFILE_PIC }} 
              style={[styles.profilePic, { backgroundColor: theme.card, borderColor: theme.card }]} 
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
        </View>

        {/* Profile Information */}
        <View style={styles.infoContainer}>
          {renderInfoSection('Location', profile?.location || '', 'location')}
          {renderInfoSection('Interests', profile?.interests || '', 'interests')}
          {renderInfoSection('Skills', profile?.skills || '', 'skills')}
          {renderInfoSection('Experience', profile?.experience || '', 'experience')}
          {renderInfoSection('Education', profile?.education || '', 'education')}
          {renderInfoSection('Social', profile?.social || '', 'social')}
          {renderInfoSection('Projects', profile?.projects || '', 'projects')}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!isEditing ? (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.primaryButtonText, { color: theme.background }]}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.primary, flex: 1, marginRight: 8 }]}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={[styles.primaryButtonText, { color: theme.background }]}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: theme.border, flex: 1, marginLeft: 8 }]}
                onPress={() => setIsEditing(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Cancel</Text>
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
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
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
              activeOpacity={0.8}
            >
              <Text style={[styles.primaryButtonText, { color: theme.background }]}>Save Changes</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePicContainer: {
    marginBottom: 20,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: COLORS.white,
    elevation: 8,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  profilePic: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.gray[100],
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  bio: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 32,
  },
  infoSection: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
  editInput: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonContainer: {
    width: '100%',
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
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.3,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
    borderBottomColor: COLORS.gray[200],
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
    height: 100,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'top',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  modalButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
});