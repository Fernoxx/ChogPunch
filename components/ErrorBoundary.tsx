// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class WalletErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a wallet-related error
    const isWalletError = error.message?.includes('ethereum') ||
                         error.message?.includes('wallet') ||
                         error.message?.includes('Cannot redefine property') ||
                         error.message?.includes('provider');

    return {
      hasError: isWalletError,
      error: isWalletError ? error : undefined
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WalletErrorBoundary caught an error:', error, errorInfo);
    
    // Only handle wallet-related errors
    if (error.message?.includes('ethereum') ||
        error.message?.includes('wallet') ||
        error.message?.includes('Cannot redefine property') ||
        error.message?.includes('provider')) {
      
      console.info('This appears to be a wallet provider conflict. The app should continue to function normally.');
      
      // Reset the error state after a short delay
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 3000);
    } else {
      // Re-throw non-wallet errors
      throw error;
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          backgroundColor: '#fff3cd',
          color: '#856404',
          textAlign: 'center',
        }}>
          <h3>Wallet Provider Conflict Detected</h3>
          <p>Multiple wallet extensions are conflicting. The app will recover automatically.</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            For the best experience, consider disabling extra wallet extensions.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#856404',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Continue
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WalletErrorBoundary;