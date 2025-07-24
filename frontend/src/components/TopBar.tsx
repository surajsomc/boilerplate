import React from 'react';
import { View, StyleSheet, Text, Animated, Easing, Pressable, ScrollView, Dimensions } from 'react-native';
import { Menu as MenuIcon } from '../lib/icons/Menu';
import { X } from '../lib/icons/X';
import { useColorScheme } from '../lib/useColorScheme';
import { BlurView } from 'expo-blur';
import Reanimated, { FadeInDown, FadeOutUp, FadeIn, FadeOut } from 'react-native-reanimated';

export default function TopBar({ pageName, menuOpen, setMenuOpen }: { pageName: string, menuOpen: boolean, setMenuOpen: (open: boolean) => void }) {
  const [displayedPage, setDisplayedPage] = React.useState(pageName);
  const [key, setKey] = React.useState(0);
  const { isDarkColorScheme } = useColorScheme();
  // Animation states
  const barScale = React.useRef(new Animated.Value(0)).current;
  const barOpacity = React.useRef(new Animated.Value(0)).current;
  const contentOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animate bar scale and opacity together, then fade in content
    Animated.sequence([
      Animated.parallel([
        Animated.timing(barScale, {
          toValue: 1,
          duration: 900, // slower
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(barOpacity, {
          toValue: 1,
          duration: 900, // slower
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Glassmorphism: semi-transparent background
  const backgroundColor = isDarkColorScheme ? 'rgba(24,24,27,0.7)' : 'rgba(255,255,255,0.7)';
  const borderColor = isDarkColorScheme ? '#27272a' : '#e5e7eb';
  const textColor = isDarkColorScheme ? '#d4d4d8' : '#52525b';
  const blurTint = isDarkColorScheme ? 'dark' : 'light';

  React.useEffect(() => {
    if (pageName !== displayedPage) {
      setKey(k => k + 1);
      setDisplayedPage(pageName);
    }
  }, [pageName]);

  return (
    <View style={styles.topBarWrap} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.topBar,
          { borderColor },
          { transform: [{ scaleX: barScale }], opacity: barOpacity },
        ]}
      >
        <BlurView intensity={30} tint={blurTint} style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor, borderRadius: 24 }]} pointerEvents="none" />
        <View style={{ flex: 1 }} />
        <Reanimated.View
          key={key}
          entering={FadeInDown.duration(250)}
          exiting={FadeOutUp.duration(250)}
          style={styles.pageNameWrap}
          pointerEvents="none"
        >
          <Text style={[styles.pageName, { color: textColor }]} numberOfLines={1}>{displayedPage}</Text>
        </Reanimated.View>
        <Animated.View style={{ opacity: contentOpacity }}>
          <Pressable
            style={styles.menuBtn}
            onPress={() => setMenuOpen(!menuOpen)}
            accessibilityRole="button"
            accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <View style={styles.iconContainer}>
              <MenuIcon size={28} color={textColor} />
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 64, // Lowered from 36 to 64
    alignItems: 'center',
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 36,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    width: '100%',
    maxWidth: 600,
    overflow: 'hidden',
  },
  pageNameWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  pageName: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginHorizontal: 8,
    maxWidth: 320,
  },
  menuBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginRight: 0,
    backgroundColor: 'transparent',
    position: 'relative',
    zIndex: 10,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    marginVertical: 6,
  },
}); 