import * as React from "react";
import autobind from "autobind-decorator";

import Button, { ButtonVariant } from "../../../../components/button";
import Checkbox from "../../../../components/checkbox";
import SearchFilterInput from "./searchFilterInput";

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
                        <SearchFilterInput placeholder="Search for Tags" onSearch={this._onSearch}></SearchFilterInput>
                    </div>
                    <div className="filter-action-buttons">
                        <Button variant={ButtonVariant.OUTLINE} onClick={this._apply}>APPLY</Button>
                        <Button variant={ButtonVariant.OUTLINE} onClick={this._cancel}>CANCEL</Button>
                    </div>
                </div>
                <div className="filter-content">
                    <Checkbox label="test" id="test1" value="test" onChange={(v) => { console.log(v); }}/>
                </div>
            </div>
        );
    }

    @autobind
    private _onSearch(value: string) {
        console.log(value);
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
