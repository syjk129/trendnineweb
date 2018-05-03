import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { ChangeEvent } from "react";
import { match } from "react-router";

import { AppContext, AppContextTypes } from "../../app";
import Input, { InputType } from "../../components/input";

import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { AuthData, RegisterData, RegisterDataProps } from "./types";

interface AuthProps {
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
    private _renderLoginForm() {
        return (
            <LoginForm
                username={this.state.username}
                password={this.state.password}
                onSubmit={this._login}
                onFormChange={this._handleFormChange}
            />
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
    private async _login(event: any) {
        event.preventDefault();
        this.context.api.authenticate(this.state.username, this.state.password);
        const user = await this.context.api.getUser();
        localStorage.setItem("user", JSON.stringify(user));
        this.props.setLoggedState(true);
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

Auth.contextTypes = AppContextTypes;
