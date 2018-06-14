import * as React from "react";
import { withRouter } from "react-router-dom";

import { isAuthError } from "../api/errors";
import RouteProps from "../flows/routeProps";

interface ErrorBoundaryProps extends RouteProps {
    errors: Array<Error>;
    children?: React.ReactNode;
    removeError(err: Error): void;
    setLoggedState(loggedIn: boolean): void;
}

// TODO: handle errors here
class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    // React children will trickle their errors up and this will catch them
    componentDidCatch(error, info) {
        if (isAuthError(error)) {
            this.props.history.push("/login");
        }
    }

    componentWillReceiveProps(nextProps: ErrorBoundaryProps) {
        if (this.props.errors.length !== nextProps.errors.length) {
            nextProps.errors.forEach(error => {
                if (isAuthError(error)) {
                    this.props.history.push("/login");
                    this.props.removeError(error);
                }
            });
        }
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(ErrorBoundary);
