import autobind from "autobind-decorator";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { IconButton } from "../button";
import Icon, { IconVariant } from "../icon";
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
        let classes = "checkbox-container";
        if (this.props.className) {
            classes += ` ${this.props.className}`;
        }

        if (isMobile) {
            classes += " mobile";
        }

        return (
            <label className={classes}>
                {this.props.label}
                <Input
                    className="checkbox"
                    type={InputType.CHECKBOX}
                    value={this.props.value}
                    checked={this.props.checked}
                    onChange={this._handleChange} />
                <div className="checkbox-checkmark-outline">
                    <span className="checkbox-checkmark"></span>
                </div>
            </label>
        );
    }

    @autobind
    private _handleChange(value: string) {
        this.props.onChange(value);
    }
}
