import autobind from "autobind-decorator";
import * as H from "history";
import { PropTypes } from "prop-types";
import * as React from "react";
import { ChangeEvent } from "react";
import { GoogleLogin, GoogleLoginResponseOffline } from "react-google-login";
import { match } from "react-router";

import { AppContext, AppContextTypes } from "../../app";
import Input, { InputType } from "../../components/input";

import FacebookLogin, { FacebookLoginResponse } from "./FacebookLogin";
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

interface AuthState {
    username: string;
    password: string;
    firstName: string | null;
    lastName: string | null;
}

type AuthFormData = Partial<RegisterData>;

export default class Auth extends React.Component<AuthProps, AuthState> {
    static contextTypes: AppContext;

    state: AuthState = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
    };

    constructor(props) {
        super(props);
        if (props.match.path === "/logout") {
            this._logout();
        } else {
            const user = localStorage.getItem("user");
            if (user !== null && user !== "undefined") {
                this.props.history.push("/");
            }
        }
    }

    render() {
        return (
            <div>
                {this._isNewUser() ? this._renderRegisterForm() : this._renderLoginForm()}
            </div>
        );
    }

    private _authToken: string;

    @autobind
    private _isNewUser(): boolean {
        // TODO: do this better
        return this.props.match.path === "/register";
    }

    @autobind
    private _isFacebookLoginCallback(): boolean {
        return this.props.location.pathname === "/login/facebook/callback";
    }

    @autobind
    private _renderLoginForm() {
        return (
            <div className="loginForm">
                <LoginForm
                    username={this.state.username}
                    password={this.state.password}
                    onSubmit={this._login}
                    onFormChange={this._handleFormChange}
                />
                <GoogleLogin
                    clientId="578583821342-677f0196i8h98lta6b9rissmphfk8g95.apps.googleusercontent.com"
                    responseType="code"
                    onSuccess={this._googleBtnSuccessCallback}
                    onFailure={this._googleBtnFailureCallback}
                />
                <FacebookLogin
                    appId="216692075781854"
                    sdkVersion="v3.0"
                    fields="name,email,picture"
                    responseType="code"
                    onCallback={this._facebookBtnCallback}
                />
            </div>
        );
    }

    @autobind
    private _renderRegisterForm() {
        return (
            <RegisterForm
                firstName={this.state.firstName}
                lastName={this.state.lastName}
                username={this.state.username}
                password={this.state.password}
                onSubmit={this._register}
                onFormChange={this._handleFormChange}
            />
        );
    }


    @autobind
    private async _googleBtnSuccessCallback(response: GoogleLoginResponseOffline) {
        this.context.api.authenticate_google(response.code);
        this._setLoggedInUser();
    }

    @autobind
    private async _googleBtnFailureCallback(response: GoogleLoginResponseOffline) {
    }

    @autobind
    private async _facebookBtnCallback(response: FacebookLoginResponse) {
        if (!response.error) {
            this.context.api.authenticate_facebook(response.code);
            this._setLoggedInUser();
        }
    }

    @autobind
    private async _login(event: any) {
        event.preventDefault();
        this.context.api.authenticate(this.state.username, this.state.password);
        this._setLoggedInUser();
    }

    @autobind
    private _logout() {
        this.props.setLoggedState(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        this.props.history.push("/");
    }

    @autobind
    private async _setLoggedInUser() {
        const user = await this.context.api.getUser();
        localStorage.setItem("user", JSON.stringify(user));
        this.props.setLoggedState(true);
        this.props.history.push("/");
    }

    @autobind
    private _register(event: any) {
        event.preventDefault();
        this.context.api.authenticate(this.state.username, this.state.password, this.state.firstName, this.state.lastName);
        this.props.setLoggedState(true);
    }

    @autobind
    private _handleFormChange(data: AuthFormData) {
        this.setState({
            username: data.username !== undefined ? data.username : this.state.username,
            password: data.password !== undefined ? data.password : this.state.password,
            firstName: data.firstName || this.state.firstName,
            lastName: data.lastName || this.state.lastName,
        });
    }
}

Auth.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};
