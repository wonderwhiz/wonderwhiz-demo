
import React, { Component, ErrorInfo, ReactNode } from 'react';
import BlockErrorState from './BlockErrorState';

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  childAge?: number;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ContentBlockErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Content block error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <BlockErrorState
          message="This content couldn't be displayed correctly."
          onRetry={this.props.onRetry}
          type="error"
          childAge={this.props.childAge}
        />
      );
    }

    return this.props.children;
  }
}

export default ContentBlockErrorBoundary;
