import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME } from '../lib/constants';

const PROFILE_PIC = 'https://randomuser.me/api/portraits/men/32.jpg'; // Placeholder image

export default function ProfileScreen() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme];
  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: 128, backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.profilePicContainer}>
        <Image source={{ uri: PROFILE_PIC }} style={[styles.profilePic, { backgroundColor: colorScheme === 'dark' ? '#27272a' : '#e5e7eb', borderColor: theme.card }]} />
      </View>
      <Text style={[styles.name, { color: theme.text }]}>Suraj Sharma</Text>
      <Text style={[styles.email, { color: colorScheme === 'dark' ? '#d4d4d8' : '#52525b' }]}>suraj@example.com</Text>
      <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }] }>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Bio</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>
          Passionate developer, React Native enthusiast, and lover of clean UI. Always learning and building cool things.
        </Text>
      </View>
      <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }] }>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Location</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>Bangalore, India</Text>
      </View>
      <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }] }>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Interests</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>Coding, Music, Travel, Fitness</Text>
      </View>
      <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }] }>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Skills</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>JavaScript, TypeScript, React Native, Node.js, GraphQL, UI/UX Design</Text>
      </View>
      <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }] }>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Experience</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>5+ years in mobile and web development. Built apps for startups and enterprises.</Text>
      </View>
      <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }] }>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Education</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>B.Tech in Computer Science, IIT Bombay</Text>
      </View>
      <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }] }>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Social</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>Twitter: @surajcodes | GitHub: surajsharma</Text>
      </View>
      <View style={[styles.infoSection, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }] }>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#a1a1aa' : '#71717a' }]}>Projects</Text>
        <Text style={[styles.infoText, { color: theme.text }]}>- Fitness Tracker App{"\n"}- Travel Journal{"\n"}- Music Discovery Platform{"\n"}- Open Source UI Kit</Text>
      </View>
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