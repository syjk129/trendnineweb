import * as React from "react";

import { AuthError } from "../api/errors";

interface ErrorBoundaryProps {
    errors: Array<Error>;
    children?: React.ReactNode;
    setLoggedState(loggedIn: boolean): void;
}

// TODO: handle errors here
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    // React children will trickle their errors up and this will catch them
    componentDidCatch(error, info) {
        // handle uncaught errors
    }

    componentWillReceiveProps(nextProps: ErrorBoundaryProps) {
        nextProps.errors.forEach(error => {
            if (error.isAuthError) {
                console.log("auth");
            }
        });
    }

    render() {
        return this.props.children;
    }
}
