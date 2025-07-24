import * as React from 'react';
import { SafeAreaView } from 'react-native';
import HomeScreen from './home';

export default function MainScreen() {
  return (
    <SafeAreaView className="flex-1 relative bg-secondary/30">
      <HomeScreen />
    </SafeAreaView>
  );
}
