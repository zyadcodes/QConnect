import React from "react";
import FirebaseFunctions from "config/FirebaseFunctions";
import ErrorComponent from "components/ErrorComponent";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  async componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // You can also log the error to an error reporting service
    await this.logErrorToMyService(error, errorInfo);
  }

  async logErrorToMyService(error, errorInfo) {
    console.log(JSON.stringify(error.toString()), JSON.stringify(errorInfo));
    try {
      await FirebaseFunctions.logEvent("FATAL_ERROR_CATCH", {
        error,
        errorInfo
      });
    } catch (err) {
      //can't log to Firebase, may be service is not reachable.
      //TODO: save the error and resend when reconnect..
      console.log(
        "can't send error to Firebase. TODO: add code to save it to storage and resend when connection is back."
      );
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorComponent
          error={this.state.error}
          retry={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
