import autobind from "autobind-decorator";
import * as React from "react";
import { ChangeEvent } from "react";

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
        const classes = `checkbox-container ${this.props.className}`;
        return (
            <label className={classes}> {this.props.label}
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

interface TreeCheckboxProps {
    value: string;
    label?: string;
    className?: string;
    checked?: boolean;
    children?: Array<TreeCheckbox>;
    parent?: TreeCheckbox;
    onChange?(value: string): void;
}

interface TreeCheckboxState {
    checked: boolean;
    expanded: boolean;
}

export class TreeCheckbox extends React.Component<TreeCheckboxProps, TreeCheckboxState> {
    state: TreeCheckboxState = {
        checked: this.props.checked,
        expanded: false,
    };

    render() {
        return (
        <div className="tree-checkbox-container">
            <div className="tree-checkbox">
                {this._renderCollapseButton()}
                <Checkbox
                    value={this.props.value}
                    label={this.props.label}
                    className={this.props.className}
                    checked={this.state.checked}
                    onChange={this._onChange} />
            </div>
            {this.state.expanded && (
                <div className="tree-checkbox-children-container">
                    {this.props.children}
                </div>
            )}
        </div>
        );
    }

    private _renderCollapseButton() {
        if (this.props.children) {
            let iconVariant = IconVariant.ARROW_RIGHT;
            if (this.state.expanded) {
                iconVariant = IconVariant.ARROW_LEFT;
            }
            return <IconButton icon={iconVariant} onClick={this._onExpand} />;
        }

        return null;
    }

    @autobind
    private _onExpand() {
        this.setState({expanded: !this.state.expanded});
    }

    @autobind
    private _onChange(value) {
        const isChecked = !this.state.checked;
        this.setState({checked: !this.state.checked});
    }
}
