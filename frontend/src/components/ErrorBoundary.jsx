import { Component } from "react";
import Button from "./ui/Button.jsx";
import Card from "./ui/Card.jsx";

/**
 * Error Boundary component to catch errors in child components
 * @class ErrorBoundary
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-white/60">
              An error occurred while loading this page. Please try again.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-4 overflow-auto rounded bg-white/5 p-3 text-xs text-white/70">
                {this.state.error.toString()}
              </pre>
            )}
            <div className="mt-4 flex gap-2">
              <Button onClick={this.resetError}>Try again</Button>
              <Button
                variant="subtle"
                onClick={() => (window.location.href = "/")}
              >
                Go home
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
