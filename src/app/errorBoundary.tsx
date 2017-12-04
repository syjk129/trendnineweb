import * as React from "react";

interface ErrorBoundaryProps {
    children?: React.ReactNode;
}

// TODO: handle errors here
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, never> {
    // React children will trickle their errors up and this will catch them
    componentDidCatch(error, info) {
        console.warn(error);
    }

    render() {
        return this.props.children;
    }
}
