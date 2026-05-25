import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-6"
          style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}
        >
          <div
            className="glass-panel max-w-md w-full p-8 rounded-2xl shadow-premium text-center border"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <span className="text-5xl mb-4 block">⚠️</span>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Something went wrong
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              An unexpected error occurred. Please try reloading the page.
            </p>
            <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl mb-6 font-mono text-left max-h-36 overflow-y-auto">
              {this.state.error?.toString() || 'Unknown error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 text-white font-medium rounded-xl transition duration-200"
              style={{ background: 'var(--color-accent)' }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
