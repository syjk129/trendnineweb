import * as React from "react";
import { PropTypes } from "prop-types";
import autobind from "autobind-decorator";
import { ChangeEvent } from "react";

import { AppContext } from "../app";
import Input, { InputType } from "../components/input";

interface AuthData {
    username: string;
    password: string;
}

interface AuthFormProps extends AuthData {
    onSubmit(event: any): void;
    onFormChange(data: Partial<AuthData>);
}

interface LoginFormProps extends AuthFormProps {}

class LoginForm extends React.Component<LoginFormProps, never> {
    render() {
        return (
            <form onSubmit={this.props.onSubmit}>
                <Input value={this.props.username} onChange={this._handleUsernameChange} />
                <Input type={InputType.PASSWORD} value={this.props.password} onChange={this._handlePasswordChange} />
                <button onSubmit={this.props.onSubmit}>Login</button>
            </form>
        );
    }

    @autobind
    private _handleUsernameChange(username: string) {
        this.props.onFormChange({ username });
    }

    @autobind
    private _handlePasswordChange(password: string) {
        this.props.onFormChange({ password });
    }
}

interface AuthProps {
    apiUrl: string;
}

interface AuthState {
    username: string;
    password: string;
}

export default class Auth extends React.Component<AuthProps, AuthState> {
    static contextTypes: AppContext;

    state: AuthState = {
        username: "",
        password: "",
    };

    render() {
        return (
            <LoginForm
                username={this.state.username}
                password={this.state.password}
                onSubmit={this._login}
                onFormChange={this._handleFormChange}
            />
        );
    }

    private _authToken: string;

    @autobind
    private _login(event: any) {
        event.preventDefault();
        this.context.api.authenticate(this.state.username, this.state.password);
    }

    @autobind
    private _handleFormChange(data: AuthData) {
        if (data.username) {
            this.setState({ username: data.username });
        }
        if (data.password) {
            this.setState({ password: data.password });
        }
    }
}

Auth.contextTypes = {
    api: PropTypes.any,
};
