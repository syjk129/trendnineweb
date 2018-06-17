import autobind from "autobind-decorator";
import * as H from "history";
import { PropTypes } from "prop-types";
import * as React from "react";
import { ChangeEvent } from "react";
import { GoogleLogin, GoogleLoginResponseOffline } from "react-google-login";
import { match } from "react-router";

import { AppContext, AppContextTypes } from "../../app";
import WithUserSession from "../../app/withUserSession";
import Input, { InputType } from "../../components/input";
import AuthForm from "./authForm";
import FacebookLogin, { FacebookLoginResponse } from "./facebookLogin";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { AuthData, RegisterData, RegisterDataProps } from "./types";


interface AuthProps {
    history: H.History;
    location: any;
    match: match<string>;
    apiUrl: string;
    setLoggedState(loggedIn: boolean): void;
}

type AuthFormData = Partial<RegisterData>;

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
            <AuthForm
                isNewUser={this._isNewUser()}
                getUser={this._getUser}
                login={this._login}
                register={this._register}
                history={this.props.history}
                location={this.props.location}
                match={this.props.match}
            />
        );
    }

    private _authToken: string;

    @autobind
    private _isNewUser(): boolean {
        // TODO: do this better
        return this.props.match.path === "/register";
    }

    @autobind
    private _login(data: AuthData) {
        return this.context.api.authenticate(data.username, data.password);
    }

    @autobind
    private _register(data: RegisterData) {
        return this.context.api.authenticate(data.username, data.password, data.firstName, data.lastName);
    }

    @autobind
    private _getUser() {
        return this.context.api.getUser();
    }

    @autobind
    private _isFacebookLoginCallback(): boolean {
        return this.props.location.pathname === "/login/facebook/callback";
    }

    @autobind
    private _logout() {
        this.props.setLoggedState(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        this.props.history.push("/");
    }
}

Auth.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};
