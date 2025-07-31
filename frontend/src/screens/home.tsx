import * as React from 'react';
import { View, Text as RNText, StyleSheet, Dimensions, FlatList, ImageBackground, Pressable } from 'react-native';
import { Card } from '../components/ui/card';
import { Utensils } from '../lib/icons/Utensils';
import { Dumbbell } from '../lib/icons/Dumbbell';
import { Bed } from '../lib/icons/Bed';
import { Briefcase } from '../lib/icons/Briefcase';
import { Plane } from '../lib/icons/Plane';
import { MessageCircle } from '../lib/icons/MessageCircle';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME } from '../lib/constants';
import { useRef, useEffect } from 'react';
import Reanimated, { withRepeat, withTiming, Easing, FadeIn } from 'react-native-reanimated';

const numColumns = 3;
const gridPadding = 24;
const gridGap = 18;
const cardSize = (Dimensions.get('window').width - gridPadding * 2 - gridGap * (numColumns - 1)) / numColumns;
const iconSize = 32;
const cardBg = '#f3f4f6'; // Tailwind's bg-gray-100
const iconColor = '#27272a'; // Tailwind's zinc-800

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingTop: 36,
  },
  welcomeContainer: {
    marginTop: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 26,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  surajText: {
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    fontWeight: '700',
    fontSize: 26,
  },
  subtitle: {
    fontFamily: 'Poppins-Medium',
    color: '#d4d4d8',
    fontSize: 16,
    marginTop: 8,
    letterSpacing: 0.1,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 32,
    marginBottom: 16,
    gap: 28,
  },
  iconCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
  },
  iconLabel: {
    color: '#d4d4d8',
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});

const funIcons = [
  { Icon: Utensils, label: 'Food' },
  { Icon: Plane, label: 'Travel' },
  { Icon: MessageCircle, label: 'Email' },
  { Icon: Dumbbell, label: 'Gym' },
  { Icon: Bed, label: 'Sleep' },
  { Icon: Briefcase, label: 'Work' },
];

function AnimatedFeatureBox({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={onPress}
      accessibilityRole="button"
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}

function FeatureBox({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <AnimatedFeatureBox onPress={onPress}>
      <Card style={{ padding: 18, borderRadius: 18, backgroundColor: '#f3f4f6', alignItems: 'center' }}>
        <RNText style={{ fontSize: 18, fontWeight: '700', color: '#18181b' }}>{title}</RNText>
      </Card>
    </AnimatedFeatureBox>
  );
}

// Placeholder gym girl images (Unsplash)
const gymGirlImages = [
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
];

// Example quote of the day
const quoteOfTheDay = {
  text: 'The only bad workout is the one that didn’t happen.',
  author: 'Unknown',
};

function TapThroughCarousel() {
  const [idx, setIdx] = React.useState(0);
  const handleNext = () => setIdx(i => (i + 1) % gymGirlImages.length);
  return (
    <Pressable onPress={handleNext} style={{ marginTop: 18, marginBottom: 2, alignItems: 'center', justifyContent: 'center' }}>
      <Reanimated.Image
        source={{ uri: gymGirlImages[idx] }}
        style={{ width: 180, height: 240, borderRadius: 24, backgroundColor: '#222', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } }}
        resizeMode="cover"
        entering={FadeIn.duration(350)}
      />
      <RNText style={{ color: '#aaa', fontSize: 13, marginTop: 8 }}>
        Tap to see next
      </RNText>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme];
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Create a long list for infinite effect
  const infiniteIcons = Array(10).fill(funIcons).flat();

  // Auto-scroll logic
  useEffect(() => {
    let scrollValue = 0;
    let scroller: ReturnType<typeof setTimeout> | undefined;
    const itemWidth = 56; // iconCol width
    const gap = 28; // separator
    const totalItemWidth = itemWidth + gap;
    const interval = 30; // ms
    const step = 1.2; // px per tick
    function scroll() {
      if (flatListRef.current) {
        scrollValue += step;
        (flatListRef.current as FlatList<any>).scrollToOffset({ offset: scrollValue, animated: false });
        if (scrollValue >= infiniteIcons.length * totalItemWidth / 2) {
          scrollValue = 0;
          (flatListRef.current as FlatList<any>).scrollToOffset({ offset: 0, animated: false });
        }
      }
      scroller = setTimeout(scroll, interval);
    }
    scroll();
    return () => { if (scroller) clearTimeout(scroller); };
  }, []);

  const handleNextImage = () => {
    setCurrentImageIndex(i => (i + 1) % gymGirlImages.length);
  };

  return (
    <ImageBackground
      source={{ uri: gymGirlImages[currentImageIndex] }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <Pressable onPress={handleNextImage} style={{ flex: 1 }}>
        <View style={{ 
          flex: 1, 
          backgroundColor: 'transparent', 
          alignItems: 'center', 
          justifyContent: 'flex-start', 
          paddingTop: 112 
        }}>
          <View style={styles.welcomeContainer}>
            <RNText style={[
              styles.welcomeText,
              { color: '#fff', fontFamily: 'CormorantGaramond-Regular', textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }
            ]}>
              Welcome back <RNText style={[
                styles.surajText,
                { color: '#fff', fontFamily: 'CormorantGaramond-Bold', textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }
              ]}>Suraj!</RNText>
            </RNText>
          </View>
          
          <FlatList
            ref={flatListRef}
            data={infiniteIcons}
            keyExtractor={(_, idx) => String(idx)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, marginTop: 0, marginBottom: 40 }}
            ItemSeparatorComponent={() => <View style={{ width: 28 }} />}
            renderItem={({ item: { Icon, label } }) => (
              <View style={styles.iconCol}>
                <Icon size={32} color={colorScheme === 'dark' ? '#fbbf24' : '#eab308'} style={{ marginBottom: 2 }} />
                <RNText style={[styles.iconLabel, { color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }]}>{label}</RNText>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
      </Pressable>
    </ImageBackground>
  );
} 