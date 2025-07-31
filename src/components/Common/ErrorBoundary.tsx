import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallbackRender: (props: { error: unknown }) => ReactNode;
};

type State = {
  hasError: boolean;
  error: unknown;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { fallbackRender, children } = this.props;

    if (hasError) {
      return fallbackRender({ error });
    }

    return children;
  }
}
