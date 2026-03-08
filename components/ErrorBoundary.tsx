import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {

  state: State = {
    hasError: false
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("UI Crash Caught:", error, errorInfo);
  }

  render() {

    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-[#0a0c10] text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>

            <p className="text-gray-400 mb-6">
              The CRM encountered an unexpected error.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#06D001] rounded-lg font-bold"
            >
              Reload CRM
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;