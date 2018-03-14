import * as React from "react";
import { ChangeEvent } from "react";
import autobind from "autobind-decorator";

import Input, { InputType } from "../input";

import "./style.scss";

interface CheckboxProps {
    value: string;
    label?: string;
    className?: string;
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
