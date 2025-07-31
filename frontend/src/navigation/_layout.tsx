import * as React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from '../lib/useColorScheme';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Animated } from 'react-native';
import { default as ReanimatedAnimated, FadeIn } from 'react-native-reanimated';
import HomeScreen from '../screens/home';
import CalendarScreen from '../screens/calendar';
import ChatScreen from '../screens/chat';
import ProfileScreen from '../screens/profile';
import { Home } from '../lib/icons/Home';
import { Calendar } from '../lib/icons/Calendar';
import { MessageCircle } from '../lib/icons/MessageCircle';
import { User } from '../lib/icons/User';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TopBar from '../components/TopBar';
import { BlurView } from 'expo-blur';
import { X } from '../lib/icons/X';
import { Menu as MenuIcon } from '../lib/icons/Menu';
import { Pressable, ScrollView, Dimensions } from 'react-native';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home,
  Calendar,
  Chat: MessageCircle,
  Profile: User,
};

const TAB_LABELS: Record<string, string> = {
  Home: 'Home',
  Calendar: 'Calendar',
  Chat: 'Chat',
  Profile: 'Profile',
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDarkColorScheme } = useColorScheme();
  // Animated values for each tab
  const scales = React.useRef(state.routes.map((_, i) => new Animated.Value(state.index === i ? 1.25 : 1))).current;

  // Animation for the label
  const labelAnim = React.useRef(new Animated.Value(1)).current;

  // Startup animation for bar and icons
  const barScale = React.useRef(new Animated.Value(0)).current;
  const barOpacity = React.useRef(new Animated.Value(0)).current;
  const iconsOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animate bar scale and opacity together, then fade in icons
    Animated.sequence([
      Animated.parallel([
        Animated.timing(barScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(barOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(iconsOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  React.useEffect(() => {
    labelAnim.setValue(0.7);
    Animated.spring(labelAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 16,
      bounciness: 8,
    }).start();
  }, [state.index]);

  React.useEffect(() => {
    state.routes.forEach((_, i) => {
      Animated.spring(scales[i], {
        toValue: state.index === i ? 1.25 : 1,
        useNativeDriver: true,
        speed: 16,
        bounciness: 8,
      }).start();
    });
  }, [state.index]);

  const currentLabel = TAB_LABELS[state.routes[state.index].name] || '';

  return (
    <>
      <View style={{ position: 'absolute', width: '100%', left: 0, right: 0, bottom: 110, alignItems: 'center', zIndex: 10 }} pointerEvents="none">
        <Animated.View
          style={{
            backgroundColor: '#18181b',
            borderRadius: 16,
            paddingHorizontal: 18,
            paddingVertical: 6,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: labelAnim,
            transform: [{ scale: labelAnim }],
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: '500',
              letterSpacing: 0.5,
              textAlign: 'center',
            }}
          >
            {currentLabel}
          </Text>
        </Animated.View>
      </View>
      <Animated.View
        style={[
          styles.tabBar,
          {
            backgroundColor: isDarkColorScheme ? '#18181b' : '#fff',
            shadowColor: '#000',
            transform: [{ scaleX: barScale }],
            opacity: barOpacity,
          },
        ]}
      >
        {state.routes.map((route, index: number) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const Icon = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const color = focused
            ? isDarkColorScheme
              ? '#fff'
              : '#18181b'
            : isDarkColorScheme
            ? '#a1a1aa'
            : '#71717a';
          return (
            <React.Fragment key={route.key}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [
                      { scale: scales[index] },
                    ],
                    opacity: iconsOpacity,
                  }}
                >
                  <Icon color={color} size={22} />
                </Animated.View>
              </TouchableOpacity>
              {index < state.routes.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          );
        })}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 32,
    borderRadius: 32,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    borderTopWidth: 0,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginHorizontal: 4,
  },
});

export default function AppNavigator() {
  const { isDarkColorScheme } = useColorScheme();
  const [currentPage, setCurrentPage] = React.useState('Home');
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Helper to get the current page name from navigation state
  function getCurrentPageName(state: any) {
    if (!state) return 'Home';
    const route = state.routes[state.index];
    return TAB_LABELS[route.name] || route.name;
  }

  const blurTint = isDarkColorScheme ? 'dark' : 'light';

  return (
    <NavigationContainer
      theme={isDarkColorScheme ? DarkTheme : DefaultTheme}
      onStateChange={(state: any) => {
        setCurrentPage(getCurrentPageName(state));
      }}
    >
      <View style={{ flex: 1 }}>
        {/* Full-screen blur and menu overlay */}
        {menuOpen && (
          <Pressable
            style={{ ...StyleSheet.absoluteFillObject, zIndex: 100 }}
            onPress={() => setMenuOpen(false)}
          >
            <BlurView
              intensity={40}
              tint={blurTint}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={{
                position: 'absolute',
                top: 88, // below TopBar
                left: 0,
                right: 0,
                alignItems: 'center',
                zIndex: 101,
              }}
              pointerEvents="box-none"
            >
              <View
                style={{
                  borderRadius: 0,
                  flex: 1,
                  width: '100%',
                  paddingHorizontal: 16,
                  paddingTop: 8,
                  paddingBottom: 8,
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  shadowColor: 'transparent',
                  alignItems: 'stretch',
                  justifyContent: 'flex-start',
                  minHeight: 0,
                  maxHeight: '100%',
                }}
              >
                <ScrollView
                  style={{ flex: 1, minHeight: 0 }}
                  contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  {['Profile','Settings','Logout','Notifications','Help & Support','Invite Friends','About','Feedback'].map((item, idx, arr) => (
                    <Pressable
                      key={item}
                      style={{
                        backgroundColor: '#000',
                        borderRadius: 32,
                        paddingVertical: 18,
                        paddingHorizontal: 28,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginBottom: idx !== arr.length - 1 ? 16 : 0,
                        shadowColor: '#000',
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                      }}
                      onPress={() => setMenuOpen(false)}
                    >
                      <ReanimatedAnimated.View entering={FadeIn.duration(350)}>
                        <Text style={{ fontSize: 18, color: '#fff', fontWeight: '600', letterSpacing: 0.2 }}>{item}</Text>
                      </ReanimatedAnimated.View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Pressable>
        )}
        <TopBar pageName={currentPage}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        <Tab.Navigator
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Calendar" component={CalendarScreen} />
          <Tab.Screen name="Chat" component={ChatScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}
