import autobind from "autobind-decorator";
import * as React from "react";
import { ChangeEvent } from "react";

import Input, { InputType } from "../input";

import "./style.scss";

interface CheckboxProps {
    value: string;
    label?: string;
    className?: string;
    checked?: boolean;
    onChange(value: string): void;
}

export default class Checkbox extends React.Component<CheckboxProps, never> {
    render() {
        return (
            <label className="checkbox-container" > {this.props.label}
                <Input
                    className="checkbox"
                    type={InputType.CHECKBOX}
                    value={this.props.value}
                    checked={this.props.checked}
                    onChange={this._handleChange} />
                <span className="checkbox-checkmark"></span>
            </label>
        );
    }

    @autobind
    private _handleChange(value: string) {
        this.props.onChange(value);
    }
}
