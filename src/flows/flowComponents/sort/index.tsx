import autobind from "autobind-decorator";
import * as React from "react";

import { SortConstants } from "./types";

import "./style.scss";

interface SortProps {
    name: string;
    default?: string;
    onSelect(queryString: string): void;
}

interface SortState {}

export default class Sort extends React.Component<SortProps, SortState> {
    render() {
        return (
            <select className="sort-select" onChange={this._select} value={this._default()} >
                {this._getSortList().map((option, i) => (
                    <option value={option}>{option}</option>
                ))}
            </select>
        );
    }

    @autobind
    private _getSortList() {
        return SortConstants.SORT_LIST;
    }

    @autobind
    private _default() {
        switch (this.props.default) {
            case SortConstants.RELEVANCE_ID:
                return SortConstants.RELEVANCE;
            case SortConstants.LATEST_ID:
                return SortConstants.LATEST;
            case SortConstants.POPULARITY_ID:
                return SortConstants.POPULARITY;
            case SortConstants.PRICE_HIGH_TO_LOW_ID:
                return SortConstants.PRICE_HIGH_TO_LOW;
            case SortConstants.PRICE_LOW_TO_HIGH_ID:
                return SortConstants.PRICE_LOW_TO_HIGH;
            default:
                return SortConstants.RELEVANCE;
        }
    }

    @autobind
    private _select(event) {
        let sort;
        switch (event.target.value) {
            case SortConstants.RELEVANCE:
                sort = SortConstants.RELEVANCE_ID;
                break;
            case SortConstants.LATEST:
                sort = SortConstants.LATEST_ID;
                break;
            case SortConstants.POPULARITY:
                sort = SortConstants.POPULARITY_ID;
                break;
            case SortConstants.PRICE_LOW_TO_HIGH:
                sort = SortConstants.PRICE_LOW_TO_HIGH_ID;
                break;
            case SortConstants.PRICE_HIGH_TO_LOW:
                sort = SortConstants.PRICE_HIGH_TO_LOW_ID;
                break;
        }
        this.props.onSelect(sort);
    }
}
