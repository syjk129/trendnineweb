import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";

import { Category, Person } from "../../../api/models";
import { AppContext, AppContextTypes } from "../../../app";
import Button, { ButtonVariant, LinkButton } from "../../../components/button";
import Icon, { IconVariant } from "../../../components/icon";
import { Filters} from "../../model/filters";
import CategoryTreeFilter from "./filterComponents/categoryTreeFilter";
import RangeFilter from "./filterComponents/rangeFilter";
import SearchFilter, { SearchCheckbox } from "./filterComponents/searchFilter";
import { FilterConstants } from "./filterComponents/types";

import "./style.scss";

export enum FilterTarget {
    POST = "post",
    PRODUCT = "product",
}

interface FilterProps {
    className?: string;
    default?: Filters;
    filterTarget: FilterTarget;
    onApply(filters: Filters): void;
}

interface FilterState {
    isFilterActive: boolean;
    activeFilter: string;
    searchResult: Set<SearchCheckbox>;
    filters: Filters;
    categories: Array<Category>;
    filterRef: any;
}

export default class Filter extends React.Component<FilterProps, FilterState> {
    static contextTypes: AppContext;
    static MAX_PRICE = 5000;

    state: FilterState = {
        isFilterActive: false,
        activeFilter: FilterConstants.CATEGORY,
        searchResult: new Set(),
        categories: [],
        filters: this.props.default || new Filters(),
        filterRef: null,
    };

    async componentDidMount() {
        document.addEventListener("mousedown", this._handleClickOutside);
    }

    async componentWillMount() {
        document.removeEventListener("mousedown", this._handleClickOutside);
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
        const filterList = this._getFilterList();
        return (
            <div ref={this._setFilterRef}>
                <div className={`filter-anchor ${this.props.className}`}>
                    <LinkButton onClick={this._toggleFilter}>
                        Filter&nbsp;&nbsp;
                        <Icon variant={this.state.isFilterActive ? IconVariant.ARROW_UP : IconVariant.ARROW_DOWN} />
                    </LinkButton>
                </div>
                <div className={`filter-content ${this.state.isFilterActive ? "" : "hidden"} ${this.props.className}`}>
                    <ul className="filter-list" >
                        {filterList
                        .map(filter => (
                            <li>
                                <LinkButton
                                    className="filter-menu"
                                    selected={this.state.activeFilter === filter}
                                    onClick={() => this._toggleSubFilter(filter)}
                                >
                                    {filter}
                                </LinkButton>
                            </li>
                        ))}
                    </ul>
                    {filterList.indexOf(FilterConstants.CATEGORY) > -1 &&
                        <CategoryTreeFilter
                            categoryList={this.state.categories}
                            selectedCategoryIds={this.state.filters.categoryIds}
                            active={this.state.activeFilter === FilterConstants.CATEGORY}
                            onApply={(v) => this._applyFilter(FilterConstants.CATEGORY_PARAM_STRING, v)}
                            onCancel={this._cancel} />
                    }
                    {filterList.indexOf(FilterConstants.BRAND) > -1 &&
                        <SearchFilter
                            placeholder="Search for Brands"
                            active={this.state.activeFilter === FilterConstants.BRAND}
                            selectedValues={this.state.filters.brandIds}
                            onApply={(v) => this._applyFilter(FilterConstants.BRAND_PARAM_STRING, v)}
                            onSearch={this._onSearchBrands}
                            searchResult={this.state.searchResult}
                            onCancel={this._cancel} />
                    }
                    {filterList.indexOf(FilterConstants.PRICE_RANGE) > -1 &&
                        <RangeFilter
                            min={0}
                            max={Filter.MAX_PRICE}
                            step={10}
                            selectedMin={Number(this.state.filters.minPrice)}
                            selectedMax={Number(this.state.filters.maxPrice)}
                            active={this.state.activeFilter === FilterConstants.PRICE_RANGE}
                            onApply={this._applyPriceRange}
                            onCancel={this._cancel} />
                    }
                    {/* <CategoryTreeFilter
                        categoryList={this.state.categories}
                        active={this.state.activeFilter === FilterConstants.ON_SALE}
                        onApply={(v) => this._applyFilter(FilterConstants.CATEGORY_PARAM_STRING, v)}
                        onCancel={this._cancel} />
                    <CategoryTreeFilter
                        categoryList={this.state.categories}
                        active={this.state.activeFilter === FilterConstants.NEW_ARRIVALS}
                        onApply={(v) => this._applyFilter(FilterConstants.CATEGORY_PARAM_STRING, v)}
                        onCancel={this._cancel} /> */}
                    {filterList.indexOf(FilterConstants.RETAILER) > -1 &&
                        <SearchFilter
                            placeholder="Search for Retailer"
                            active={this.state.activeFilter === FilterConstants.RETAILER}
                            selectedValues={this.state.filters.retailerIds}
                            onApply={(v) => this._applyFilter(FilterConstants.RETAILER_PARAM_STRING, v)}
                            onSearch={this._onSearchRetailers}
                            searchResult={this.state.searchResult}
                            onCancel={this._cancel} />
                    }
                    {filterList.indexOf(FilterConstants.TAG) > -1 &&
                        <SearchFilter
                            placeholder="Search for Tags"
                            active={this.state.activeFilter === FilterConstants.TAG}
                            selectedValues={this.state.filters.tagIds}
                            onApply={(v) => this._applyFilter(FilterConstants.TAG_PARAM_STRING, v)}
                            onSearch={this._onSearchTags}
                            searchResult={this.state.searchResult}
                            onCancel={this._cancel} />
                    }
                </div>
            </div>
        );
    }

    @autobind
    private _getFilterList() {
        let filterList = [];
        switch (this.props.filterTarget) {
            case FilterTarget.POST:
                filterList = [
                    FilterConstants.CATEGORY,
                    FilterConstants.BRAND,
                    FilterConstants.PRICE_RANGE,
                    FilterConstants.RETAILER,
                    FilterConstants.TAG,
                ];
                break;
            case FilterTarget.PRODUCT:
                filterList = [
                    FilterConstants.CATEGORY,
                    FilterConstants.BRAND,
                    FilterConstants.PRICE_RANGE,
                    FilterConstants.RETAILER,
                ];
                break;
        }
        return filterList;
    }

    @autobind
    private _setFilterRef(element: any) {
        this.setState({ filterRef: element });
    }

    @autobind
    private _handleClickOutside(event) {
        if (this.state.isFilterActive && !this.state.filterRef.contains(event.target)) {
            this._cancel();
        }
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
                this._onSearchRetailers();
                break;
            case FilterConstants.TAG:
                this.setState({searchResult: new Set()});
                break;
            case FilterConstants.BRAND:
                this._onSearchBrands();
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
    private async _onSearchBrands(value?: string) {
        const brands = await this.context.api.getBrands(value);
        const searchedRetailerCheckboxes = brands.map(b => {
            return new SearchCheckbox(b.id, `${b.name} (${b.item_count})`);
        });
        this.setState({searchResult: new Set(searchedRetailerCheckboxes)});
    }

    @autobind
    private async _onSearchRetailers(value?: string) {
        const retailers = await this.context.api.getRetailers(value);
        const searchedRetailerCheckboxes = retailers.map(r => {
            return new SearchCheckbox(r.id, `${r.name} (${r.item_count})`);
        });
        this.setState({searchResult: new Set(searchedRetailerCheckboxes)});
    }

    @autobind
    private async _onSearchCategories(value: string) {
    }

    @autobind
    private _applyFilter(filter: string, values: Set<string>) {
        const currentFilters = this.state.filters;
        const newValues = Array.from(values);
        switch (filter) {
            case FilterConstants.CATEGORY_PARAM_STRING:
                currentFilters.categoryIds = newValues;
                break;
            case FilterConstants.BRAND_PARAM_STRING:
                currentFilters.brandIds = newValues;
                break;
            case FilterConstants.RETAILER_PARAM_STRING:
                currentFilters.retailerIds = newValues;
                break;
            case FilterConstants.TAG_PARAM_STRING:
                currentFilters.tagIds = newValues;
                break;
        }

        this._apply(currentFilters);
    }

    @autobind
    private _applyPriceRange(min: number, max: number) {
        const currentFilters = this.state.filters;
        currentFilters.maxPrice = max.toString();
        currentFilters.minPrice = min.toString();
        this._apply(currentFilters);
    }

    @autobind
    private _apply(filters: Filters) {
        this.setState({ filters: filters, isFilterActive: false });
        this.props.onApply(filters);
    }

    @autobind
    private _cancel() {
        this.setState({ isFilterActive: false });
    }
}

Filter.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};
