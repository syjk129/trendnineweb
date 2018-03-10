import * as React from "react";
import autobind from "autobind-decorator";

import Button, { ButtonVariant } from "../../../../components/button";
import Search from "../../../../components/search";

import "./style.scss";

interface TagFilterProps {
    active: boolean;
 }

 interface TagFilterState {
    value: Array<string>;
    previousValue: Array<string>;
}

export default class TagFilter extends React.Component<TagFilterProps, TagFilterState> {
    state: TagFilterState = {
        value: [],
        previousValue: [],
    };

    render() {
        const { active } = this.props;

        return (
            <div className={`filter-content-container ${active ? "" : "hidden"}`}>
                <div className="filter-action-bar">
                    <div className="filter-action">
                        <Search placeholder="Search for Tags"></Search>
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
    private _cancel() {
        this.setState({value: this.state.previousValue});
    }

    @autobind
    private _apply() {
        this.setState({previousValue: this.state.value});
    }
}
