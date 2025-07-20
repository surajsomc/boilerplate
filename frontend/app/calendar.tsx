import * as React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function CalendarScreen() {
  return (
    <View className='flex-1 justify-center items-center p-6 bg-background'>
      <Text className='text-2xl font-light text-muted-foreground mb-2'>Calendar</Text>
      <Text className='text-base text-muted-foreground text-center'>
        This is your calendar page.
      </Text>
    </View>
  );
} 