import * as React from "react";
import { ChangeEvent } from "react";
import autobind from "autobind-decorator";

import enumify from "../../libs/enumify";

import "./style.scss";

export enum InputType {
    TEXT = "text",
    PASSWORD = "password",
}

interface InputProps {
    value: string;
    type?: InputType;
    onChange(value: string): void;
}

export default class Input extends React.Component<InputProps, never> {
    static defaultProps = {
        type: InputType.TEXT,
    };

    render() {
        return (
            <input value={this.props.value} onChange={this._handleChange} type={this.props.type} />
        );
    }

    @autobind
    private _handleChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        this.props.onChange(event.target.value);
    }
}
