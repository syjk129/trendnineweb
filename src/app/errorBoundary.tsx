import * as React from "react";

interface ErrorBoundaryProps {
    children?: React.ReactNode;
    setLoggedState(loggedIn: boolean): void;
}

// TODO: handle errors here
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    // React children will trickle their errors up and this will catch them
    componentDidCatch(error, info) {
        console.log("yo");
        console.warn(error);

        // If unauthorized error
        // this.props.setLoggedState(false);
    }

    render() {
        return this.props.children;
    }
}
