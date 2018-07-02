import autobind from "autobind-decorator";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import * as React from "react";

import Button, { ButtonSize, ButtonVariant } from "../../../../components/button";

import "./style.scss";

interface RangeFilterProps {
    active: boolean;
    min: number;
    max: number;
    step: number;
    selectedMin?: number;
    selectedMax?: number;
    onApply(min: number, max: number): void;
    onCancel(): void;
}

interface RangeFilterState {
    value: Array<number>;
    previousValue: Array<number>;
}

export default class RangeFilter extends React.Component<RangeFilterProps, RangeFilterState> {
    state: RangeFilterState = {
        value: [this.props.selectedMin || this.props.min, this.props.selectedMax || this.props.max],
        previousValue: [this.props.min, this.props.max],
    };

    render() {
        const { active, min, max, step } = this.props;

        let classes = "filter-content-container";

        if (!active) {
            classes += " hidden";
        }

        return (
            <div className={classes}>
                <div className="filter-action-bar">
                    <div className="filter-action">
                        <div>
                            <div className="filter-value">
                                <span className="filter-value">
                                    ${this.state.value[0]}
                                </span>
                                <span className="filter-value">
                                    ${this.state.value[1]}+
                                </span>
                            </div>
                            <Range min={min} max={max} step={step} allowCross={false} value={this.state.value} onChange={this._onSliderChange} />
                        </div>
                    </div>
                    <div className="filter-action-buttons">
                        <Button size={ButtonSize.SMALL} rounded variant={ButtonVariant.PRIMARY} onClick={this._apply}>APPLY</Button>
                        <Button size={ButtonSize.SMALL} rounded variant={ButtonVariant.OUTLINE} onClick={this._cancel}>CANCEL</Button>
                    </div>
                </div>
                <div className="filter-content">
                </div>
            </div>
        );
    }

    @autobind
    private _onSliderChange(value: Array<number>) {
        this.setState({ value });
    }

    @autobind
    private _cancel() {
        this.setState({value: this.state.previousValue});
        this.props.onCancel();
    }

    @autobind
    private _apply() {
        this.setState({previousValue: this.state.value});
        this.props.onApply(this.state.value[0], this.state.value[1]);
    }
}
