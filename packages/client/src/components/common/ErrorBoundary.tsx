import React from 'react';
import ErrorComponent from '@/components/common/ErrorComponent';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
};

type ErrorBoundaryState = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info);
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <ErrorComponent
          code={500}
          title='Internal Server Error'
          description={
            process.env.NODE_ENV === 'development' && this.state.error
              ? this.state.error.message
              : "Sorry, something went wrong on our end. We're working to fix the issue."
          }
        />
      );
    }
    return this.props.children;
  }
}
