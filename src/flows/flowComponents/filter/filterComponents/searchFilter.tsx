import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";

import Button, { ButtonVariant } from "../../../../components/button";
import Checkbox from "../../../../components/checkbox";
import SearchFilterInput from "./searchFilterInput";

import "./style.scss";

interface SearchFilterProps {
    placeholder: string;
    active: boolean;
    searchResult: Set<SearchCheckbox>;
    selectedValues?: Array<string>;
    onSearch(value: string): void;
    onApply(values: Set<string>): void;
    onCancel(): void;
 }

interface SearchFilterState {
    selectedValues: Set<string>;
    previousValues: Set<string>;
    hasSearched: boolean;
    selectedCheckboxes: Array<SearchCheckbox>;
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
        selectedValues: this.props.selectedValues ? new Set(this.props.selectedValues) : new Set(),
        previousValues: new Set(),
        hasSearched: false,
        selectedCheckboxes: [],
    };

    render() {
        return (
            <div className={`filter-content-container ${this.props.active ? "" : "hidden"}`}>
                <div className="filter-action-bar">
                    <div className="filter-action">
                        <SearchFilterInput
                            placeholder={this.props.placeholder}
                            onSearch={this._onSearch} />
                    </div>
                    <div className="filter-action-buttons">
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            onClick={this._onApply}>APPLY</Button>
                        <Button variant={ButtonVariant.OUTLINE} onClick={this._cancel}>CANCEL</Button>
                    </div>
                </div>
                <div className="filter-content">
                    <ul className={`filter-result-list ${this.props.searchResult.size > 0 || this.state.selectedValues.size > 0 ? "" : "hidden"}`}>
                        { this._renderSearchResult(Array.from(this.state.selectedCheckboxes), true) }
                        { this._renderSearchResult(Array.from(this.props.searchResult), false) }
                    </ul>
                    <div
                        className={`filter-no-result ${!this.state.hasSearched || this.props.searchResult.size > 0 ? "hidden" : ""}`}>
                        No results found.
                    </div>
                </div>
            </div>
        );
    }

    @autobind
    private _onSearch(value: string) {
        this.props.onSearch(value);
        if (value.length > 0) {
            this.setState({hasSearched: true});
        } else {
            this.setState({hasSearched: false});
        }
    }

    @autobind
    private _onApply() {
        this.setState({previousValues: new Set(this.state.selectedValues)});
        this.props.onApply(this.state.selectedValues);
    }

    @autobind
    private _renderSearchResult(values: Array<SearchCheckbox>, shouldFilter: boolean) {
        return values
        .filter(v => !shouldFilter || Array.from(this.props.searchResult).filter(vv => vv.value === v.value).length < 1)
        .map(v => (
            <li>
                <Checkbox
                    value={v.value}
                    label={v.label}
                    onChange={(value) => this._updateValues(v)}
                    checked={this.state.selectedValues.has(v.value)}
                />
             </li>
        ));
    }

    @autobind
    private _updateValues(searchCheckbox: SearchCheckbox) {
        let v = this.state.selectedValues;
        let selected = this.state.selectedCheckboxes;
        if (v.has(searchCheckbox.value)) {
            v.delete(searchCheckbox.value);
            selected = selected.filter(s => s.value !== searchCheckbox.value);
        } else {
            v.add(searchCheckbox.value);
            selected.push(searchCheckbox);
        }
        this.setState({selectedValues: v, selectedCheckboxes: selected});
    }

    @autobind
    private _cancel() {
        this.setState({selectedValues: new Set(this.state.previousValues)});
        this.props.onCancel();
    }
}
