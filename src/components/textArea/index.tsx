import autobind from "autobind-decorator";
import { ChangeEvent } from "react";
import * as React from "react";

import "./style.scss";

interface TextAreaProps {
    value: string;
    placeholder?: string;
    className?: string;
    onChange(value: string): void;
}

export default class TextArea extends React.Component<TextAreaProps, never> {
    render() {
        return (
            <textarea
                className={this.props.className}
                placeholder={this.props.placeholder}
                value={this.props.value}
                onChange={this._handleChange}
            />
        );
    }

    @autobind
    private _handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        event.preventDefault();
        this.props.onChange(event.target.value);
    }
}
