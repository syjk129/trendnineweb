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
    hasSearched: boolean;
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
        hasSearched: false,
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
                    <ul className={`filter-result-list ${this.props.searchResult.length > 0 ? "" : "hidden"}`}>
                        { this._renderSearchResult() }
                    </ul>
                    <div className={`filter-no-result ${!this.state.hasSearched || this.props.searchResult.length > 0 ? "hidden" : ""}`}>
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
        this.props.onApply(this.state.values);
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
        console.log("BEGINNING");
        console.log(this.state);
        let v = this.state.values;
        if (v.has(value)) {
            v.delete(value);
        } else {
            v.add(value);
        }
        this.setState({values: v});
        console.log("END");
        console.log(this.state);
    }

    @autobind
    private _cancel() {
        this.setState({values: this.state.previousValues});
        // TODO: unselect the checkboxes
    }
}
