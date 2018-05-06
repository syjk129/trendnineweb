import autobind from "autobind-decorator";
import { ChangeEvent } from "react";
import * as React from "react";

import "./style.scss";

interface TextAreaProps {
    value: string;
    rounded?: boolean;
    placeholder?: string;
    className?: string;
    onChange(value: string): void;
}

export default class TextArea extends React.Component<TextAreaProps, never> {
    render() {
        let classes = this.props.className || "";
        if (this.props.rounded) {
            classes += " rounded";
        }

        return (
            <textarea
                className={classes}
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
