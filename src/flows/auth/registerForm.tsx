import * as React from "react";

import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import { ChangeEvent } from "react";

import { AppContext } from "../../app";
import Input, { InputType } from "../../components/input";

import { AuthFormProps } from "./types";

interface RegisterFormProps extends AuthFormProps {
    firstName: string;
    lastName: string;
}

export default class RegisterForm extends React.Component<RegisterFormProps, never> {
    render() {
        return (
            <form onSubmit={this.props.onSubmit}>
                <Input value={this.props.firstName} onChange={this._handleFirstNameChange} />
                <Input value={this.props.lastName} onChange={this._handleLastNameChange} />
                <Input value={this.props.username} onChange={this._handleUsernameChange} />
                <Input type={InputType.PASSWORD} value={this.props.password} onChange={this._handlePasswordChange} />
                <button onSubmit={this.props.onSubmit}>Login</button>
            </form>
        );
    }

    @autobind
    private _handleFirstNameChange(firstName: string) {
        this.props.onFormChange({ firstName });
    }

    @autobind
    private _handleLastNameChange(lastName: string) {
        this.props.onFormChange({ lastName });
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
