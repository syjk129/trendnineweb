import * as React from "react";
import { Range } from "rc-slider";
import autobind from "autobind-decorator";

import Anchor, { AnchorVariant } from "../../../../components/anchor";
import Button, { ButtonVariant } from "../../../../components/button";

import "./style.scss";
import "rc-slider/assets/index.css";

interface RangeFilterProps {
    active: boolean;
    min: number;
    max: number;
    step: number;
    onApply(min: number, max: number): void;
}

interface RangeFilterState {
    value: Array<number>;
    previousValue: Array<number>;
}

export default class RangeFilter extends React.Component<RangeFilterProps, RangeFilterState> {
    state: RangeFilterState = {
        value: [this.props.min, this.props.max],
        previousValue: [this.props.min, this.props.max],
    };

    render() {
        const { active, min, max, step } = this.props;

        return (
            <div className={`filter-content-container ${active ? "" : "hidden"}`}>
                <div className="filter-action-bar">
                    <div className="filter-action">
                        <div>
                            {this.state.value[0]} {this.state.value[1]}
                            <Range min={min} max={max} step={step} allowCross={false} value={this.state.value} onChange={this._onSliderChange} />
                        </div>
                    </div>
                    <div className="filter-action-buttons">
                        <Button variant={ButtonVariant.OUTLINE} onClick={this._apply}>APPLY</Button>
                        <Button variant={ButtonVariant.OUTLINE} onClick={this._cancel}>CANCEL</Button>
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
    }

    @autobind
    private _apply() {
        this.setState({previousValue: this.state.value});
        this.props.onApply(this.state.value[0], this.state.value[1]);
    }
}
