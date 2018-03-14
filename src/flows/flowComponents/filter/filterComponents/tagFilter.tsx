import * as React from "react";
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";

import Button, { ButtonVariant } from "../../../../components/button";
import Checkbox from "../../../../components/checkbox";
import SearchFilterInput from "./searchFilterInput";
import { AppContext } from "../../../../app";
import { Tag } from "../../../../api/models";

import "./style.scss";

interface TagFilterProps {
    active: boolean;
 }

 interface TagFilterState {
    values: Set<string>;
    previousValues: Set<string>;
    searchedTags: Array<Tag>;
}

export default class TagFilter extends React.Component<TagFilterProps, TagFilterState> {
    static contextTypes: AppContext;

    state: TagFilterState = {
        values: new Set(),
        previousValues: new Set(),
        searchedTags: [],
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
                    <ul className={`filter-result-list ${this.state.searchedTags.length > 0 ? "" : "hidden"}`}>
                        { this._renderTags() }
                    </ul>
                </div>
            </div>
        );
    }

    @autobind
    private async _onSearch(value: string) {
        this.setState({searchedTags: await this.context.api.getTags(value)});
    }

    @autobind
    private _renderTags() {
        return this.state.searchedTags.map(tag => (
            <li>
                <Checkbox
                    value={tag.id}
                    label={tag.content}
                    onChange={this._updateValues}
                />
             </li>
        ));
    }

    @autobind
    private _updateValues(value: string) {
        let v = this.state.values;
        if (!v.delete(value)) {
            v.add(value);
        }
        this.setState({values: v});
        console.log(v);
    }

    @autobind
    private _cancel() {
        this.setState({values: this.state.previousValues});
    }

    @autobind
    private _apply() {
        this.setState({previousValues: this.state.values});
    }
}

TagFilter.contextTypes = {
    api: PropTypes.any,
};
