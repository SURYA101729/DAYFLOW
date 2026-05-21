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
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-6 text-[#1E3A5F]">
          <div className="glass-panel max-w-md w-full p-8 rounded-2xl shadow-premium text-center border-red-200">
            <span className="text-5xl mb-4 block">⚠️</span>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-slate-600 mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl mb-6 font-mono text-left max-h-36 overflow-y-auto">
              {this.state.error?.toString() || 'Unknown error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-primary-accent hover:bg-blue-600 text-white font-medium rounded-xl transition duration-200 shadow-premium"
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
