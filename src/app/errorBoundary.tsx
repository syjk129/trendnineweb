import autobind from "autobind-decorator";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { isAuthError, isPermissionError } from "../api/errors";
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
            this.props.history.push(`${this.props.location.pathname}/login`);
        } else if (isPermissionError(error)) {
            this.props.history.push("/");
        }
    }

    componentWillReceiveProps(nextProps: ErrorBoundaryProps) {
        if (this.props.errors.length !== nextProps.errors.length) {
            this._handleErrors(nextProps);
        }
    }

    render() {
        return this.props.children;
    }

    @autobind
    private _handleErrors(props: ErrorBoundaryProps) {
        props.errors.forEach(error => {
            if (isAuthError(error)) {
                this.props.history.push(`${this.props.location.pathname}/login`);
            } else if (isPermissionError(error)) {
                this.props.history.push("/");
            }
            // for now, remove all errors
            this.props.removeError(error);
        });
    }
}

export default withRouter(ErrorBoundary);
