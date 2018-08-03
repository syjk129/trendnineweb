import autobind from "autobind-decorator";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { isAuthError, isPermissionError, isCorruptedUserError } from "../api/errors";
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
        this._handleError(error);
    }

    componentWillReceiveProps(nextProps: ErrorBoundaryProps) {
        if (this.props.errors.length !== nextProps.errors.length) {
            nextProps.errors.forEach(error => {
                this._handleError(error);
            });
        }
    }

    render() {
        return this.props.children;
    }

    private _handleError = (error: Error) => {
        if (isAuthError(error)) {
            if (!this.props.location.pathname.includes("login")) {
                this.props.history.push({ pathname: "/login", state: { modal: true } });
            }
        } else if (isPermissionError(error)) {
            this.props.history.push("/discover");
        } else if (isCorruptedUserError(error)) {
            localStorage.removeItem("user");
            localStorage.removeItem("tn_auth_token");
            localStorage.removeItem("refresh_token");
            this.props.history.push("/discover");
        }
        // for now, remove all errors
        this.props.removeError(error);
    }
}

export default withRouter(ErrorBoundary);
