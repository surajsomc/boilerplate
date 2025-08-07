import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME, COLORS } from '../lib/constants';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme];
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const fadeOutOpacity = useRef(new Animated.Value(1)).current;

  const startAnimation = useCallback(() => {
    // Logo entrance animation
    Animated.sequence([
      // Logo scales up and fades in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Text fades in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(500),
      // Fade out everything
      Animated.timing(fadeOutOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete();
    });
  }, [onAnimationComplete, logoScale, logoOpacity, textOpacity, fadeOutOpacity]);

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      startAnimation();
    }, 100);

    return () => {
      clearTimeout(timer);
      // Clean up animations
      logoScale.stopAnimation();
      logoOpacity.stopAnimation();
      textOpacity.stopAnimation();
      fadeOutOpacity.stopAnimation();
    };
  }, [startAnimation]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.background,
          opacity: fadeOutOpacity,
        }
      ]}
    >
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={[styles.logo, { backgroundColor: theme.primary }]}>
            <Text style={[styles.logoText, { color: theme.background }]}>
              P
            </Text>
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.Text
          style={[
            styles.appName,
            { 
              color: theme.text,
              opacity: textOpacity,
            },
          ]}
        >
          ProfileApp
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            { 
              color: theme.textSecondary,
              opacity: textOpacity,
            },
          ]}
        >
          Connect • Share • Grow
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    letterSpacing: 1,
  },
}); 