import * as React from 'react';
import { View } from 'react-native';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Utensils } from '~/lib/icons/Utensils';
import { Dumbbell } from '~/lib/icons/Dumbbell';
import { Bed } from '~/lib/icons/Bed';
import { Briefcase } from '~/lib/icons/Briefcase';
import { Plane } from '~/lib/icons/Plane';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';

interface FeatureBoxProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}

// Animated wrapper for feature boxes
interface AnimatedFeatureBoxProps {
  children: React.ReactNode;
  onPress?: () => void;
}

function AnimatedFeatureBox({ children, onPress }: AnimatedFeatureBoxProps) {
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
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}

function FeatureBox({ icon, title, onPress }: FeatureBoxProps) {
  return (
    <AnimatedFeatureBox onPress={onPress}>
      <Card className='w-32 h-32 items-center justify-center'>
        {icon}
        <Text className='text-base font-light text-muted-foreground'>{title}</Text>
      </Card>
    </AnimatedFeatureBox>
  );
}

const featureData: FeatureBoxProps[] = [
  {
    icon: <Utensils size={40} strokeWidth={1} className='text-muted-foreground mb-2' />,
    title: 'Food',
  },
  {
    icon: <Dumbbell size={40} strokeWidth={1} className='text-muted-foreground mb-2' />,
    title: 'Gym',
  },
  {
    icon: <Bed size={40} strokeWidth={1} className='text-muted-foreground mb-2' />,
    title: 'Sleep',
  },
  {
    icon: <Briefcase size={40} strokeWidth={1} className='text-muted-foreground mb-2' />,
    title: 'Work',
  },
  {
    icon: <Plane size={40} strokeWidth={1} className='text-muted-foreground mb-2' />,
    title: 'Travel',
  },
];

export default function HomePage() {
  const handleFeaturePress = (title: string) => {
    // Handle feature press - can be extended later
    console.log(`Feature pressed: ${title}`);
  };

  return (
    <>
      {/* Feature Boxes Grid */}
      <View className='w-full flex-row flex-wrap justify-center gap-4 mt-4'>
        {featureData.map((feature) => (
          <FeatureBox
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            onPress={() => handleFeaturePress(feature.title)}
          />
        ))}
      </View>
      
      {/* Welcome Message Below Icons */}
      <Text className='mt-8 text-xl font-light text-muted-foreground text-center'>
        Welcome back <Text style={{ fontFamily: 'Poppins-Bold' }}>Suraj</Text>
      </Text>
    </>
  );
} 