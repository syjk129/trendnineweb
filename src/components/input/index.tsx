import autobind from "autobind-decorator";
import * as React from "react";
import { ChangeEvent } from "react";

import { generateUUID } from "../../util/uuid";
import "./style.scss";

export enum InputType {
    TEXT = "text",
    EMAIL = "email",
    PASSWORD = "password",
    CHECKBOX = "checkbox",
    FILE = "file",
    SUBMIT = "submit",
    SEARCH = "search",
    NUMERIC = "number",
}

export enum InputVariant {
    BLANK,
    OUTLINE,
    UNDERLINE,
}

export enum InputTheme {
    LIGHT,
    DARK,
}

export interface InputProps {
    id?: string;
    value?: string;
    className?: string;
    type?: InputType;
    variant?: InputVariant;
    theme?: InputTheme;
    placeholder?: string;
    disabled?: boolean;
    checked?: boolean;
    required?: boolean;
    autofocus?: boolean;
    error?: string;
    onChange?(value: any): void;
    onEnterPress?(value: any): void;
}

export default class Input extends React.Component<InputProps, never> {
    static defaultProps = {
        type: InputType.TEXT,
    };

    render() {
        const { className, variant, theme, autofocus, error } = this.props;

        let classes = "";

        if (className) {
            classes += ` ${className}`;
        }

        switch (theme) {
            case InputTheme.LIGHT:
                classes += " light";
                break;
        }

        switch (variant) {
            case InputVariant.BLANK:
                classes += " blank";
                break;
            case InputVariant.OUTLINE:
                classes += " outline";
                break;
            case InputVariant.UNDERLINE:
                classes += " underline";
                break;
        }

        if (this.props.type === InputType.SUBMIT) {
            classes += " button";
        }

        const id = this.props.id || generateUUID();

        return (
            <>
                <input
                    id={id}
                    className={classes}
                    value={this.props.value}
                    onChange={this._handleChange}
                    onKeyPress={this._handleKeyPress}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled}
                    checked={this.props.checked}
                    type={this.props.type}
                    required={this.props.required}
                    autoFocus={autofocus}
                />
                {error && (
                    <label className="input-error-msg" htmlFor={id}>{error}</label>
                )}
            </>
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
