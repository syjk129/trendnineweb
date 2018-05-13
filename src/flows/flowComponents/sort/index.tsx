import autobind from "autobind-decorator";
import * as React from "react";

import { SortConstants } from "./types";

import "./style.scss";

interface SortProps {
    name: string;
    onSelect(queryString: string): void;
}

interface SortState {

}

export default class Sort extends React.Component<SortProps, SortState> {
    render() {
        return (
            <select className="sort-select" onChange={this._select} >
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
    private _select(event) {
        let sort;
        switch (event.target.value) {
            case SortConstants.RELEVANCE:
                sort = "relevance";
                break;
            case SortConstants.LATEST:
                sort = "latest";
                break;
            case SortConstants.POPULARITY:
                sort = "popularity";
                break;
            case SortConstants.PRICE_LOW_TO_HIGH:
                sort = "price_low_to_high";
                break;
            case SortConstants.PRICE_HIGH_TO_LOW:
                sort = "price_high_to_low";
                break;
        }
        this.props.onSelect(`order_by=${sort}`);
    }
}
