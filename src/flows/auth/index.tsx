import * as React from "react";
import { PropTypes } from "prop-types";
import autobind from "autobind-decorator";
import { ChangeEvent } from "react";
import { match } from "react-router";

import { AppContext } from "../../app";
import Input, { InputType } from "../../components/input";

import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { AuthData, RegisterData, RegisterDataProps } from "./types";

interface AuthProps {
    match: match<string>;
    apiUrl: string;
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
    private _login(event: any) {
        event.preventDefault();
        this.context.api.authenticate(this.state.username, this.state.password);
    }

    @autobind
    private _register(event: any) {
        event.preventDefault();
        this.context.api.register(this.state.firstName, this.state.lastName, this.state.username, this.state.password);
    }

    @autobind
    private _handleFormChange(data: AuthFormData) {
        this.setState({
            username: data.username || this.state.username,
            password: data.password || this.state.password,
            firstName: data.firstName || this.state.firstName,
            lastName: data.lastName || this.state.lastName,
        });
    }
}

Auth.contextTypes = {
    api: PropTypes.any,
};
