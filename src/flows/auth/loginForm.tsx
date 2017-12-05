import * as React from "react";
import { PropTypes } from "prop-types";
import autobind from "autobind-decorator";
import { ChangeEvent } from "react";

import { AppContext } from "../../app";
import Input, { InputType } from "../../components/input";

import { AuthData, AuthFormProps } from "./types";

interface LoginFormProps extends AuthFormProps {}

export default class LoginForm extends React.Component<LoginFormProps, never> {
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
