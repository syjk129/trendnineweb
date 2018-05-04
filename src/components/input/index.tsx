import autobind from "autobind-decorator";
import * as React from "react";
import { ChangeEvent } from "react";

import "./style.scss";

export enum InputType {
    TEXT = "text",
    PASSWORD = "password",
    CHECKBOX = "checkbox",
}

export enum InputVariant {
    BLANK,
    OUTLINE,
}

interface InputProps {
    value?: string;
    className?: string;
    type?: InputType;
    variant?: InputVariant;
    placeholder?: string;
    disabled?: boolean;
    checked?: boolean;
    onChange?(value: any): void;
    onEnterPress?(value: any): void;
}

export default class Input extends React.Component<InputProps, never> {
    static defaultProps = {
        type: InputType.TEXT,
    };

    render() {
        const { className, variant } = this.props;

        let classes = "";

        if (className) {
            classes += ` ${className}`;
        }

        switch (variant) {
            case InputVariant.BLANK:
                classes += " blank";
                break;
            case InputVariant.OUTLINE:
                classes += " outline";
                break;
        }

        return (
            <input
                className={classes}
                value={this.props.value}
                onChange={this._handleChange}
                onKeyPress={this._handleKeyPress}
                placeholder={this.props.placeholder}
                disabled={this.props.disabled}
                checked={this.props.checked}
                type={this.props.type}
            />
        );
    }

    @autobind
    private _handleChange(event: ChangeEvent<HTMLInputElement>) {
        if (this.props.onChange && this.props.type !== InputType.CHECKBOX) {
            event.preventDefault();
        }
        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        }
    }

    @autobind
    private _handleKeyPress(event) {
        if (this.props.onEnterPress && event.key === "Enter") {
            event.preventDefault();
            this.props.onEnterPress(event.target.value);
        }
    }
}
