import autobind from "autobind-decorator";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { GoogleLogin, GoogleLoginResponseOffline } from "react-google-login";

import { Person } from "../../api/models";
import Button, { ButtonVariant } from "../../components/button";
import Input, { InputType, InputVariant } from "../../components/input";
import RouteProps from "../routeProps";
import FacebookLogin, { FacebookLoginResponse } from "./facebookLogin";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { AuthData, RegisterData, RegisterDataProps } from "./types";

import "./style.scss";

type AuthFormData = Partial<RegisterData>;

interface AuthFormProps extends RouteProps {
    isNewUser: boolean;
    getUser(): Promise<Person>;
    login(data: AuthData): Promise<void>;
    register(data: RegisterData): Promise<void>;
}

interface AuthFormState {
    username: string;
    password: string;
    firstName: string | null;
    lastName: string | null;
    isNewUser: boolean;
}

export default class AuthForm extends React.Component<AuthFormProps, AuthFormState> {
    state: AuthFormState = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        isNewUser: this.props.isNewUser,
    };

    render() {
        const { login, register } = this.props;

        return (
            <div className={isMobile ? "mobile-auth-form" : "auth-form"}>
                {this.state.isNewUser ? (
                    <form onSubmit={this._register}>
                        <p className="form-name">New Account</p>
                        <Input
                            placeholder="Email Address"
                            value={this.state.username}
                            variant={InputVariant.UNDERLINE}
                            onChange={(username) => this._handleFormChange({ username })}
                        />
                        <Input
                            placeholder="Password"
                            type={InputType.PASSWORD}
                            variant={InputVariant.UNDERLINE}
                            value={this.state.password}
                            onChange={(password) => this._handleFormChange({ password })}
                        />
                        <Input
                            placeholder="First Name"
                            variant={InputVariant.UNDERLINE}
                            value={this.state.firstName}
                            onChange={(firstName) => this._handleFormChange({ firstName })}
                        />
                        <Input
                            placeholder="Last Name"
                            variant={InputVariant.UNDERLINE}
                            value={this.state.lastName}
                            onChange={(lastName) => this._handleFormChange({ lastName })}
                        />
                        <Button onClick={this._login}>Login</Button>
                    </form>
                ) : (
                    <form onSubmit={this._login}>
                        <p className="form-name">Account Login</p>
                        <Input
                            placeholder="Email Address"
                            value={this.state.username}
                            variant={InputVariant.UNDERLINE}
                            onChange={(username) => this._handleFormChange({ username })}
                        />
                        <Input
                            placeholder="Password"
                            type={InputType.PASSWORD}
                            variant={InputVariant.UNDERLINE}
                            value={this.state.password}
                            onChange={(password) => this._handleFormChange({ password })}
                        />
                        <Button onClick={this._login}>Login</Button>
                    </form>
                )}
                <GoogleLogin
                    className="google-login"
                    clientId="174930742509-kvp3mkdgdb5c8staoesefgltj377tgsq.apps.googleusercontent.com"
                    responseType="code"
                    onSuccess={this._googleBtnSuccessCallback}
                    onFailure={this._googleBtnFailureCallback}
                />
                <FacebookLogin
                    appId="201224070695370"
                    sdkVersion="v3.0"
                    fields="name,email,picture"
                    responseType="code"
                    onCallback={this._facebookBtnCallback}
                />
                <div className="toggle-register">
                    {this.state.isNewUser ? (
                        <div>
                            <p>Have an account?</p>
                            <Button onClick={this._toggleRegister}>Login</Button>
                        </div>
                    ) : (
                        <div>
                            <p>Don't have an account?</p>
                            <Button onClick={this._toggleRegister}>Create Account</Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    @autobind
    private _toggleRegister() {
        this.setState({ isNewUser: !this.state.isNewUser });
    }

    @autobind
    private _login() {
        const loginResponse = this.props.login({
            username: this.state.username,
            password: this.state.password,
        });
        this._setLoggedInUser();
    }

    @autobind
    private _register(event: any) {
        event.preventDefault();
        this.props.register({
            username: this.state.username,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
        });
        this._setLoggedInUser();
    }

    @autobind
    private async _setLoggedInUser() {
        const user = await this.props.getUser();
        if (user && user.username) {
            localStorage.setItem("user", JSON.stringify(user));
            this.props.history.push("/");
        }
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
}
