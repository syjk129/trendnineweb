import * as React from "react";
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";

import Button, { ButtonVariant } from "../../../../components/button";
import Checkbox from "../../../../components/checkbox";
import SearchFilterInput from "./searchFilterInput";

import "./style.scss";

interface SearchFilterProps {
    placeholder: string;
    active: boolean;
    searchResult: Array<SearchCheckbox>;
    onSearch(value: string): void;
    onApply(values: Set<string>): void;
 }

interface SearchFilterState {
    values: Set<string>;
    previousValues: Set<string>;
}

 export class SearchCheckbox {
    value: string;
    label: string;

    constructor(value: string, label: string) {
        this.value = value;
        this.label = label;
    }
}

export default class SearchFilter extends React.Component<SearchFilterProps, SearchFilterState> {
    state: SearchFilterState = {
        values: new Set(),
        previousValues: new Set(),
    };

    render() {
        return (
            <div className={`filter-content-container ${this.props.active ? "" : "hidden"}`}>
                <div className="filter-action-bar">
                    <div className="filter-action">
                        <SearchFilterInput
                            placeholder={this.props.placeholder}
                            onSearch={this.props.onSearch} />
                    </div>
                    <div className="filter-action-buttons">
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            onClick={() => this.props.onApply(this.state.values)}>APPLY</Button>
                        <Button variant={ButtonVariant.OUTLINE} onClick={this._cancel}>CANCEL</Button>
                    </div>
                </div>
                <div className="filter-content">
                    <ul className={`filter-result-list ${this.props.searchResult.length > 0 ? "" : "hidden"}`}>
                        { this._renderSearchResult() }
                    </ul>
                </div>
            </div>
        );
    }

    @autobind
    private _renderSearchResult() {
        return this.props.searchResult.map(v => (
            <li>
                <Checkbox
                    value={v.value}
                    label={v.label}
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
    }

    @autobind
    private _cancel() {
        this.setState({values: this.state.previousValues});
        // TODO: unselect the checkboxes
    }
}
