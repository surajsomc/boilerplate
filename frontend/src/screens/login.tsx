import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Animated,
} from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME, COLORS } from '../lib/constants';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAnimations, setShowAnimations] = useState(false);
  
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme];
  const { login, register } = useAuth();

  // Animation values
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(40)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  const startAnimations = useCallback(() => {
    // Title animation
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(titleTranslateY, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtitle animation (delayed)
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Form animation (delayed)
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(formTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Button animation (delayed)
    Animated.sequence([
      Animated.delay(600),
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Footer animation (delayed)
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleOpacity, titleTranslateY, subtitleOpacity, subtitleTranslateY, formOpacity, formTranslateY, buttonOpacity, buttonScale, footerOpacity]);

  useEffect(() => {
    // Start animations after a short delay
    const timer = setTimeout(() => {
      setShowAnimations(true);
      startAnimations();
    }, 100);

    return () => {
      clearTimeout(timer);
      // Clean up animations
      titleOpacity.stopAnimation();
      titleTranslateY.stopAnimation();
      subtitleOpacity.stopAnimation();
      subtitleTranslateY.stopAnimation();
      formOpacity.stopAnimation();
      formTranslateY.stopAnimation();
      buttonOpacity.stopAnimation();
      buttonScale.stopAnimation();
      footerOpacity.stopAnimation();
    };
  }, [startAnimations]);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isRegistering && !email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await register(username, email, password);
        Alert.alert('Success', 'Account created successfully!');
      } else {
        await login(username, password);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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
            <Animated.Text 
              style={[
                styles.title, 
                { 
                  color: theme.text,
                  opacity: titleOpacity,
                  transform: [{ translateY: titleTranslateY }],
                }
              ]}
            >
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </Animated.Text>
            
            <Animated.Text 
              style={[
                styles.subtitle, 
                { 
                  color: theme.textSecondary,
                  opacity: subtitleOpacity,
                  transform: [{ translateY: subtitleTranslateY }],
                }
              ]}
            >
              {isRegistering ? 'Sign up to get started with your journey' : 'Sign in to continue your journey'}
            </Animated.Text>
          </View>

          {/* Form Section */}
          <Animated.View 
            style={[
              styles.formSection,
              {
                opacity: formOpacity,
                transform: [{ translateY: formTranslateY }],
              }
            ]}
          >
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Username</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {isRegistering && (
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border
                  }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <Animated.View
              style={{
                opacity: buttonOpacity,
                transform: [{ scale: buttonScale }],
              }}
            >
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, { color: theme.background }]}>
                  {loading ? 'Loading...' : (isRegistering ? 'Create Account' : 'Sign In')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Footer Section */}
          <Animated.View 
            style={[
              styles.footerSection,
              {
                opacity: footerOpacity,
              }
            ]}
          >
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsRegistering(!isRegistering)}
              activeOpacity={0.7}
            >
              <Text style={[styles.switchText, { color: theme.textSecondary }]}>
                {isRegistering 
                  ? 'Already have an account? ' 
                  : "Don't have an account? "
                }
              </Text>
              <Text style={[styles.switchText, { color: theme.primary, fontWeight: '600' }]}>
                {isRegistering ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 50,
  },
  form: {
    width: '100%',
    maxWidth: 400,
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
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
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
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.3,
  },
  footerSection: {
    alignItems: 'center',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  switchText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
}); 