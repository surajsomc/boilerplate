import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '~/components/ui/navigation-menu';
import { User } from '~/lib/icons/User';
import { Home } from '~/lib/icons/Home';
import { Search } from '~/lib/icons/Search';
import { Calendar } from '~/lib/icons/Calendar';
import { MessageCircle } from '~/lib/icons/MessageCircle';
import ProfileScreen from './profile';
import HomePage from './home';
import CalendarScreen from './calendar';
import ChatScreen from './chat';
import ErrorBoundary from './error-boundary';
import type { NavigationValue, AnimatedNavIconProps } from './types';

// Animated wrapper for navbar icons
function AnimatedNavIcon({ children, onPress }: AnimatedNavIconProps) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(1.08, { damping: 10 });
        rotate.value = withSpring(5, { damping: 10 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12 });
        rotate.value = withSpring(0, { damping: 12 });
      }}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}

function MainScreen() {
  const [navValue, setNavValue] = React.useState<NavigationValue>('home');

  const handleNavigation = (value: NavigationValue) => {
    setNavValue(value);
  };

  const renderCurrentScreen = () => {
    switch (navValue) {
      case 'profile':
        return <ProfileScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <View className='flex-1'>
      {renderCurrentScreen()}
      {/* Rounded Navbar absolutely at the bottom */}
      <View className='absolute left-0 right-0 bottom-0 w-full px-4 items-center'>
        <NavigationMenu
          className='rounded-full bg-background/80 border border-border shadow-md w-full max-w-xl py-4 flex-row items-center'
          value={navValue}
          onValueChange={(value) => {
            if (value && value !== 'search') {
              handleNavigation(value as NavigationValue);
            }
          }}
        >
          <NavigationMenuList className='flex-row items-center'>
            <NavigationMenuItem value='home'>
              <AnimatedNavIcon onPress={() => handleNavigation('home')}>
                <Home className={navValue === 'home' ? 'text-primary' : 'text-muted-foreground'} size={32} strokeWidth={1} />
              </AnimatedNavIcon>
            </NavigationMenuItem>
            <View className='h-10 w-1 bg-border mx-4 rounded-full' />
            <NavigationMenuItem value='search'>
              <AnimatedNavIcon>
                <Search className={navValue === 'search' ? 'text-primary' : 'text-muted-foreground'} size={32} strokeWidth={1} />
              </AnimatedNavIcon>
            </NavigationMenuItem>
            <View className='h-10 w-1 bg-border mx-4 rounded-full' />
            <NavigationMenuItem value='calendar'>
              <AnimatedNavIcon onPress={() => handleNavigation('calendar')}>
                <Calendar className={navValue === 'calendar' ? 'text-primary' : 'text-muted-foreground'} size={32} strokeWidth={1} />
              </AnimatedNavIcon>
            </NavigationMenuItem>
            <View className='h-10 w-1 bg-border mx-4 rounded-full' />
            <NavigationMenuItem value='chat'>
              <AnimatedNavIcon onPress={() => handleNavigation('chat')}>
                <MessageCircle className={navValue === 'chat' ? 'text-primary' : 'text-muted-foreground'} size={32} strokeWidth={1} />
              </AnimatedNavIcon>
            </NavigationMenuItem>
            <View className='h-10 w-1 bg-border mx-4 rounded-full' />
            <NavigationMenuItem value='profile'>
              <AnimatedNavIcon onPress={() => handleNavigation('profile')}>
                <User className={navValue === 'profile' ? 'text-primary' : 'text-muted-foreground'} size={32} strokeWidth={1} />
              </AnimatedNavIcon>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </View>
    </View>
  );
}

export default function Screen() {
  return (
    <SafeAreaView className="flex-1 relative bg-secondary/30">
      <MainScreen />
    </SafeAreaView>
  );
}
