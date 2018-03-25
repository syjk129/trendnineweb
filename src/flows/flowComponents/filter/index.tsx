import * as React from "react";
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";

import { Person, Category } from "../../../api/models";
import Button, { ButtonVariant } from "../../../components/button";
import Anchor, { AnchorVariant } from "../../../components/anchor";
import Icon, { IconVariant } from "../../../components/icon";
import { AppContext } from "../../../app";
import CategoryTreeFilter from "./filterComponents/categoryTreeFilter";
import RangeFilter from "./filterComponents/rangeFilter";
import SearchFilter, { SearchCheckbox } from "./filterComponents/searchFilter";
import { FilterConstants } from "./filterComponents/types";

import "./style.scss";

interface FilterProps {
    onApply(queryString: string): void;
}

interface FilterState {
    isFilterActive: boolean;
    activeFilter: string;
    searchResult: Set<SearchCheckbox>;
    filterMap: Map<string, string>;
    categories: Array<Category>;
}

export default class Filter extends React.Component<FilterProps, FilterState> {
    static contextTypes: AppContext;
    static MAX_PRICE = 5000;

    state: FilterState = {
        isFilterActive: false,
        activeFilter: FilterConstants.CATEGORY,
        searchResult: new Set(),
        categories: [],
        filterMap: new Map(),
    };

    async componentWillMount() {
        try {
            const categories = await this.context.api.getCategories();

            this.setState({
                categories: categories,
            });
        } catch (err) {
            console.warn(err);
        }
    }

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
                        {FilterConstants.FILTER_LIST
                        .map(filter => (
                            <li>
                                <Anchor
                                    className={this.state.activeFilter === filter ? "selected" : ""}
                                    variant={AnchorVariant.SECONDARY}
                                    onClick={() => this._toggleSubFilter(filter)}>{filter}</Anchor>
                            </li>
                        ))}
                    </ul>
                    <CategoryTreeFilter
                        categoryList={this.state.categories}
                        active={this.state.activeFilter === FilterConstants.CATEGORY}
                        onApply={(v) => this._applyFilter(FilterConstants.CATEGORY_PARAM_STRING, v)}
                        onCancel={this._cancel} />
                    <SearchFilter
                        placeholder="Search for Brands"
                        active={this.state.activeFilter === FilterConstants.BRAND}
                        onApply={(v) => this._applyFilter(FilterConstants.BRAND_PARAM_STRING, v)}
                        onSearch={this._onSearchTags}
                        searchResult={this.state.searchResult}
                        onCancel={this._cancel} />
                    <RangeFilter
                        min={0}
                        max={Filter.MAX_PRICE}
                        step={10}
                        active={this.state.activeFilter === FilterConstants.PRICE_RANGE}
                        onApply={this._applyPriceRange}
                        onCancel={this._cancel} />
                    <CategoryTreeFilter
                        categoryList={this.state.categories}
                        active={this.state.activeFilter === FilterConstants.ON_SALE}
                        onApply={(v) => this._applyFilter(FilterConstants.CATEGORY_PARAM_STRING, v)}
                        onCancel={this._cancel} />
                    <CategoryTreeFilter
                        categoryList={this.state.categories}
                        active={this.state.activeFilter === FilterConstants.NEW_ARRIVALS}
                        onApply={(v) => this._applyFilter(FilterConstants.CATEGORY_PARAM_STRING, v)}
                        onCancel={this._cancel} />
                    <SearchFilter
                        placeholder="Search for Retailer"
                        active={this.state.activeFilter === FilterConstants.RETAILER}
                        onApply={(v) => this._applyFilter(FilterConstants.RETAILER_PARAM_STRING, v)}
                        onSearch={this._onSearchRetailers}
                        searchResult={this.state.searchResult}
                        onCancel={this._cancel} />
                    <SearchFilter
                        placeholder="Search for Tags"
                        active={this.state.activeFilter === FilterConstants.TAG}
                        onApply={(v) => this._applyFilter(FilterConstants.TAG_PARAM_STRING, v)}
                        onSearch={this._onSearchTags}
                        searchResult={this.state.searchResult}
                        onCancel={this._cancel} />
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

        switch (stateField) {
            case FilterConstants.RETAILER:
                this._onSearchRetailers("");
                break;
            case FilterConstants.TAG:
                this.setState({searchResult: new Set()});
                break;
            case FilterConstants.BRAND:
                this.setState({searchResult: new Set()});
                break;
            default:
                this.setState({searchResult: new Set()});
                break;
        }
    }

    @autobind
    private async _onSearchTags(value: string) {
        if (value.length < 1) {
            return;
        }

        const tags = await this.context.api.getTags(value);
        const searchedTagCheckboxes = tags.map(t => {
            return new SearchCheckbox(t.content, `${t.content} (${t.item_count})`);
        });
        this.setState({searchResult: new Set(searchedTagCheckboxes)});
    }

    @autobind
    private async _onSearchRetailers(value: string) {
        const retailers = await this.context.api.getRetailers(value);
        const searchedRetailerCheckboxes = retailers.map(r => {
            return new SearchCheckbox(r.merchant, `${r.merchant} (${r.item_count})`);
        });
        this.setState({searchResult: new Set(searchedRetailerCheckboxes)});
    }

    @autobind
    private async _onSearchCategories(value: string) {
    }

    @autobind
    private _applyFilter(filter: string, values: Set<string>) {
        let filters = this.state.filterMap;

        if (values.size > 0) {
            filters.set(filter, Array.from(values).join(","));
        } else {
            filters.delete(filter);
        }

        this._apply(filters);
    }

    @autobind
    private _applyPriceRange(min: number, max: number) {
        let filters = this.state.filterMap;

        if (min === 0) {
            filters.delete(FilterConstants.MIN_PRICE_PARAM_STRING);
        } else {
            filters.set(FilterConstants.MIN_PRICE_PARAM_STRING, min.toString());
        }
        if (max === Filter.MAX_PRICE) {
            filters.delete(FilterConstants.MAX_PRICE_PARAM_STRING);
        } else {
            filters.set(FilterConstants.MAX_PRICE_PARAM_STRING, max.toString());
        }

        this._apply(filters);
    }

    @autobind
    private _apply(filters: Map<string, string>) {
        this.setState({ filterMap: filters, isFilterActive: false });
        const queryString = Array.from(filters.keys()).map(key => key + "=" + filters.get(key)).join("&");
        this.props.onApply(queryString);
    }

    @autobind
    private _cancel() {
        this.setState({ isFilterActive: false });
    }
}

Filter.contextTypes = {
    api: PropTypes.any,
};
