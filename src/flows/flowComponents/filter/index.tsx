import * as React from "react";
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";

import { Person } from "../../../api/models";
import Button, { ButtonVariant } from "../../../components/button";
import Anchor, { AnchorVariant } from "../../../components/anchor";
import Icon, { IconVariant } from "../../../components/icon";
import PriceFilter from "./filterComponents/priceFilter";
import { AppContext } from "../../../app";
import SearchFilter, { SearchCheckbox } from "./filterComponents/searchFilter";

import "./style.scss";

interface FilterProps { }

interface FilterState {
    isFilterActive: boolean;
    activeFilter: string;
    searchResult: Array<SearchCheckbox>;
}

export default class Filter extends React.Component<FilterProps, FilterState> {
    static contextTypes: AppContext;
    static CATEGORY = "CATEGORY";
    static BRAND = "BRAND";
    static PRICE_RANGE = "PRICE RANGE";
    static ON_SALE = "ON SALE";
    static NEW_ARRIVALS = "NEW ARRIVALS";
    static RETAILER = "RETAILER";
    static TAG = "TAG";
    static FILTER_LIST = [
        Filter.CATEGORY,
        Filter.BRAND,
        Filter.PRICE_RANGE,
        Filter.ON_SALE,
        Filter.NEW_ARRIVALS,
        Filter.RETAILER,
        Filter.TAG,
    ];

    state: FilterState = {
        isFilterActive: false,
        activeFilter: Filter.CATEGORY,
        searchResult: [],
    };

    render() {
        return (
            <div className="filter-container">
                <div className="filter-anchor">
                    <Anchor
                        variant={AnchorVariant.SECONDARY}
                        onClick={this._toggleFilter}>Filter&nbsp;&nbsp;
                        <Icon variant={this.state.isFilterActive ? IconVariant.ARROW_UP : IconVariant.ARROW_DOWN} />
                    </Anchor>
                </div>
                <div className={`filter-content ${this.state.isFilterActive ? "" : "hidden"}`}>
                    <ul className="filter-list" >
                        {Filter.FILTER_LIST
                        .map(filter => (
                            <li>
                                <Anchor
                                    className={this.state.activeFilter === filter ? "selected" : ""}
                                    variant={AnchorVariant.SECONDARY}
                                    onClick={() => this._toggleSubFilter(filter)}>{filter}</Anchor>
                            </li>
                        ))}
                    </ul>
                    <SearchFilter
                        placeholder="Search for Categories"
                        active={this.state.activeFilter === Filter.CATEGORY}
                        onApply={this._apply}
                        onSearch={this._onSearchTags}
                        searchResult={this.state.searchResult} />
                    <SearchFilter
                        placeholder="Search for Brands"
                        active={this.state.activeFilter === Filter.BRAND}
                        onApply={this._apply}
                        onSearch={this._onSearchTags}
                        searchResult={this.state.searchResult} />
                    <PriceFilter min={0} max={5000} step={10} active={this.state.activeFilter === Filter.PRICE_RANGE}></PriceFilter>
                    <SearchFilter
                        placeholder="Search for Categories On Sale"
                        active={this.state.activeFilter === Filter.ON_SALE}
                        onApply={this._apply}
                        onSearch={this._onSearchTags}
                        searchResult={this.state.searchResult} />
                    <SearchFilter
                        placeholder="Search for New Arrival Categories"
                        active={this.state.activeFilter === Filter.NEW_ARRIVALS}
                        onApply={this._apply}
                        onSearch={this._onSearchTags}
                        searchResult={this.state.searchResult} />
                    <SearchFilter
                        placeholder="Search for Retailer"
                        active={this.state.activeFilter === Filter.RETAILER}
                        onApply={this._apply}
                        onSearch={this._onSearchTags}
                        searchResult={this.state.searchResult} />
                    <SearchFilter
                        placeholder="Search for Tags"
                        active={this.state.activeFilter === Filter.TAG}
                        onApply={this._apply}
                        onSearch={this._onSearchTags}
                        searchResult={this.state.searchResult} />
                </div>
            </div>
        );
    }

    @autobind
    private _toggleFilter() {
        this.setState({isFilterActive: !this.state.isFilterActive});
    }

    @autobind
    private _toggleSubFilter(stateField: string) {
        this.setState({activeFilter: stateField});
    }

    @autobind
    private async _onSearchTags(value: string) {
        const tags = await this.context.api.getTags(value);
        const searchedTagCheckboxes = tags.map(t => {
            return new SearchCheckbox(t.id, t.content);
        });
        this.setState({searchResult: searchedTagCheckboxes});
    }

    @autobind
    private _apply(values: Set<string>) {
        console.log(values);
    }
}

Filter.contextTypes = {
    api: PropTypes.any,
};
