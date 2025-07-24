export interface ProfileField {
  label: string;
  value: string;
}

export interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export interface FeatureBoxProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}

export type NavigationValue = 'home' | 'search' | 'calendar' | 'chat' | 'profile';

export interface AnimatedFeatureBoxProps {
  children: React.ReactNode;
  onPress?: () => void;
}

export interface AnimatedNavIconProps {
  children: React.ReactNode;
  onPress?: () => void;
} 