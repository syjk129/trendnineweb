import * as React from "react";
import { ChangeEvent } from "react";
import autobind from "autobind-decorator";

import "./style.scss";

export enum InputType {
    TEXT = "text",
    PASSWORD = "password",
    CHECKBOX = "checkbox",
}

interface InputProps {
    value: string;
    className?: string;
    type?: InputType;
    placeholder?: string;
    disabled?: boolean;
    checked?: boolean;
    onChange(value: any): void;
}

export default class Input extends React.Component<InputProps, never> {
    static defaultProps = {
        type: InputType.TEXT,
    };

    render() {
        return (
            <input
                className={this.props.className}
                value={this.props.value}
                onChange={this._handleChange}
                placeholder={this.props.placeholder}
                disabled={this.props.disabled}
                checked={this.props.checked}
                type={this.props.type}
            />
        );
    }

    @autobind
    private _handleChange(event: ChangeEvent<HTMLInputElement>) {
        if (this.props.type !== InputType.CHECKBOX) {
            event.preventDefault();
        }
        this.props.onChange(event.target.value);
    }
}
