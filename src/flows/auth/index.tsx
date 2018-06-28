import autobind from "autobind-decorator";
import * as H from "history";
import { PropTypes } from "prop-types";
import * as React from "react";
import { ChangeEvent } from "react";
import { GoogleLoginResponseOffline } from "react-google-login";
import { match } from "react-router";

import { AppContext, AppContextTypes } from "../../app";
import WithUserSession from "../../app/withUserSession";
import Input, { InputType } from "../../components/input";
import Modal from "../../components/modal";
import Cookies from "../../util/cookies";
import RouteProps from "../routeProps";
import AuthForm from "./authForm";
import FacebookLogin, { FacebookLoginResponse } from "./facebookLogin";
import { AuthData } from "./types";


interface AuthProps extends RouteProps {
    apiUrl: string;
    close(): void;
    setLoggedState(loggedIn: boolean): void;
}

export default class Auth extends React.Component<AuthProps> {
    static contextTypes: AppContext;

    constructor(props) {
        super(props);
        if (props.match.path === "/logout") {
            this._logout();
        } else {
            const user = localStorage.getItem("user");
            const token = localStorage.getItem("tn_auth_token");

            if (user !== null && user !== "undefined" && token && token !== "undefined") {
                const exp = JSON.parse(atob(token.split(".")[1]))["exp"];
                const current = (new Date()).getTime() / 1000;

                if (exp > current) {
                    this.props.history.push("/");
                } else {
                    localStorage.removeItem("tn_auth_token");
                }
            }
        }
    }

    render() {
        return (
            <Modal isOpen close={this.props.close}>
                <AuthForm
                    getUser={this._getUser}
                    authenticate={this._authenticate}
                    authenticateFacebook={this._authenticateFacebook}
                    authenticateGoogle={this._authenticateGoogle}
                    history={this.props.history}
                    location={this.props.location}
                    match={this.props.match}
                />
            </Modal>
        );
    }

    private _authToken: string;

    @autobind
    private _isNewUser(): boolean {
        // TODO: do this better
        return this.props.match.path === "/register";
    }

    private _authenticate = async (data: AuthData) => {
        await this.context.api.authenticate(data.email, data.password);
        this.props.setLoggedState(true);
        this.props.close();
    }

    @autobind
    private _getUser() {
        return this.context.api.getUser();
    }

    @autobind
    private _authenticateGoogle(response: GoogleLoginResponseOffline) {
        return this.context.api.authenticateGoogle(response.code);
    }

    @autobind
    private _authenticateFacebook(response: FacebookLoginResponse) {
        return this.context.api.authenticateFacebook(response.code);
    }

    @autobind
    private _isFacebookLoginCallback(): boolean {
        return this.props.location.pathname === "/login/facebook/callback";
    }

    @autobind
    private _logout() {
        this.props.setLoggedState(false);
        localStorage.removeItem("user");
        localStorage.removeItem("tn_auth_token");
        this.props.history.push("/");
    }
}

Auth.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
