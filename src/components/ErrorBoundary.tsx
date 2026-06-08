import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/** Catches render errors and displays a recovery UI instead of crashing */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
          <ErrorState
            error={{
              type: 'unknown',
              message: this.state.error?.message ?? 'An unexpected error occurred.',
              retryable: true,
            }}
            onRetry={this.handleRetry}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
