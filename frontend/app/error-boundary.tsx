import * as React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <View className='flex-1 justify-center items-center p-6 bg-background'>
          <Text className='text-2xl font-semibold text-destructive mb-4'>Something went wrong</Text>
          <Text className='text-base text-muted-foreground text-center mb-6'>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button onPress={this.resetError} className='bg-primary'>
            <Text className='text-primary-foreground'>Try Again</Text>
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 