import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { Category, FilterSearchResult } from "../../../api/models";
import { AppContext } from "../../../app";
import { ContentType } from "../../model";
import RouteProps from "../../routeProps";
import { UserContentType } from "../../user/types";
import MobileContentToolbar from "./mobile";
import {
    Filter,
    FilterCategory,
    FilterOption,
    FilterQueryParamMap,
    FilterType,
    isRangeValueFilter,
    isTreeSelectFilter,
    RangeValueFilter,
    SelectFilter,
    SortQueryParamMap,
    SortType,
    ToolbarType,
    TreeSelectFilter,
} from "./types";

import "./style.scss";

interface ContentToolbarProps extends RouteProps {
    className?: string;
    loggedIn: boolean;
    gridSize: number;
    // sortType: SortType;
    contentType: ContentType | UserContentType;
    setGridSize?(size: number): void;
    // setSortType(sortType: SortType): void;
}

interface ContentToolbarState {
    activeToolbar: ToolbarType | null;
    hasChanged: boolean;
    filterOptions: Array<FilterOption>;
    sortTypes: Array<SortType>;
    filters: Map<FilterType, Array<FilterSearchResult>>;
    selectedFilters: Map<FilterType, Filter>;
    currentCategory: Array<Category> | null;
    currentFilterType: FilterType | null;
    currentSortType: SortType;
    searchString: string;
}

export default class ContentToolbar extends React.Component<ContentToolbarProps, ContentToolbarState> {
    static contextTypes: AppContext;

    state: ContentToolbarState = {
        activeToolbar: null,
        hasChanged: false,
        filterOptions: this._getFilterTypes(this.props.contentType),
        sortTypes: this._getSortTypes(),
        filters: new Map(),
        selectedFilters: new Map(),
        currentCategory: null,
        currentFilterType: null,
        currentSortType: SortType.RELEVANCE,
        searchString: "",
    };

    componentWillMount() {
        this._populateFilters();
    }

    componentWillUnmount() {
        clearTimeout(this._searchTimeout);
    }

    render() {
        const {
            setGridSize,
        } = this.props;

        return (
            <div>
                <BrowserView device={isBrowser}>
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileContentToolbar
                        {...this.state}
                        gridSize={this.props.gridSize}
                        selectFilterType={this._selectFilterType}
                        selectSortType={this._selectSortType}
                        selectCurrentCategory={this._selectCurrentCategory}
                        toggleCategory={this._toggleCategory}
                        toggleSelectFilterItem={this._toggleSelectFilterItem}
                        toggleActiveToolbar={this._toggleActiveToolbar}
                        onSearchStringChange={this._onSearchStringChange}
                        onRangeFilterChange={this._onRangeFilterChange}
                        removeFilterItem={this._removeFilterItem}
                        setGridSize={setGridSize}
                        clearFilters={this._clearFilters}
                    />
                </MobileView>
            </div>
        );
    }

    private _searchTimeout: any;

    private _clearFilters = () => {
        switch (this.props.contentType) {
            case ContentType.POST:
                this.props.history.push("/discover");
                break;
            case ContentType.PRODUCT:
            case ContentType.SHOP:
                this.props.history.push("/shop");
                break;
        }
        this.setState({ activeToolbar: null });
    }

    private _onRangeFilterChange = (min: number, max: number) => {
        const selectedFilters = this.state.selectedFilters;
        let selectFilter = selectedFilters[this.state.currentFilterType] || new RangeValueFilter;

        selectFilter.minValue = min;
        selectFilter.maxValue = max;
        selectedFilters[this.state.currentFilterType] = selectFilter;

        this.setState({ selectedFilters, hasChanged: true });
    }

    @autobind
    private async _onSearchStringChange(searchString: string) {
        this._searchTimeout = setTimeout(async () => {
            const filters = this.state.filters;
            filters[this.state.currentFilterType] = await this._getFilterContent(this.state.currentFilterType, this.state.searchString);
            this.setState({ filters });
        }, 1000);
        this.setState({ searchString, hasChanged: true });
    }

    @autobind
    private async _populateFilters() {
        const filters = this.state.filters;
        for (const filterOption of this.state.filterOptions) {
            filters[filterOption.type] = await this._getFilterContent(filterOption.type, this.state.searchString);
        }

        // Update selectedFilters
        const selectedFilters = this.state.selectedFilters;
        let sortType = this.state.currentSortType;
        if (location.search) {
            const queryParams = location.search.slice(1).split("&");
            queryParams.forEach(queryParam => {
                const [filterType, values] = queryParam.split("=");
                const sanitizedValues = decodeURI(values);
                if (filterType.toLowerCase() === "sort") {
                    sortType = SortQueryParamMap[sanitizedValues.toLowerCase()];
                } else if (filterType.toLowerCase() === "price_low") {
                    const rangeFilter = selectedFilters[FilterType.PRICE_RANGE] || new RangeValueFilter;
                    rangeFilter.minValue = sanitizedValues;
                    selectedFilters[FilterType.PRICE_RANGE] = rangeFilter;
                } else if (filterType.toLowerCase() === "price_high") {
                    const rangeFilter = selectedFilters[FilterType.PRICE_RANGE] || new RangeValueFilter;
                    rangeFilter.maxValue = sanitizedValues;
                    selectedFilters[FilterType.PRICE_RANGE] = rangeFilter;
                } else if (filterType.toLowerCase() === FilterQueryParamMap[FilterType.CATEGORY]) {
                    const treeFilter = selectedFilters[FilterType.CATEGORY] || new TreeSelectFilter;
                    treeFilter.selectedTree.categories = filters[FilterType.CATEGORY];
                    treeFilter.selectedTree.populateSelectedCategories(sanitizedValues.split(","));
                    selectedFilters[FilterQueryParamMap[filterType]] = treeFilter;
                } else {
                    selectedFilters[FilterQueryParamMap[filterType]] = { selectedIds: sanitizedValues.split(",") } as SelectFilter;
                }
            });
        }
        this.setState({ filters, selectedFilters, currentSortType: sortType });
    }

    private _getFilterContent = async (filterType: FilterType, query?: string) => {
        switch (filterType) {
            case FilterType.BRANDS:
                const brands = await this.context.api.getBrands(query);
                return brands.list;
            case FilterType.CATEGORY:
                return await this.context.api.getCategories();
            case FilterType.PRICE_RANGE:
                return new RangeValueFilter();
            case FilterType.RETAILER:
                return await this.context.api.getRetailers(query);
            case FilterType.TAGS:
                return await this.context.api.getTags(query);
            default:
                throw new Error(`Unsupported filter type ${filterType}`);
        }
    }

    @autobind
    private _toggleActiveToolbar(toolbarType: ToolbarType) {
        if (this.state.activeToolbar && this.state.activeToolbar === toolbarType && this.state.hasChanged) {
            this._applyFilters();
        }
        this.setState({
            activeToolbar: this.state.activeToolbar === toolbarType ? null : toolbarType,
            hasChanged: false,
        });
    }

    @autobind
    private _removeFilterItem(filterId: string) {
        let selectedFilters = this.state.selectedFilters;
        Object.keys(selectedFilters).forEach(filterType => {
            if (selectedFilters[filterType].selectedIds.some(id => id === filterId)) {
                selectedFilters[filterType].selectedIds = selectedFilters[filterType].selectedIds.filter(id => id !== filterId);
            }
        });
        this.setState({ selectedFilters }, this._applyFilters);
    }

    @autobind
    private _toggleSelectFilterItem(filterId: string) {
        const selectedFilters = this.state.selectedFilters;
        let selectFilter = selectedFilters[this.state.currentFilterType] || new SelectFilter;

        // Toggle
        if (selectFilter.selectedIds.includes(filterId)) {
            selectFilter.selectedIds.splice(selectFilter.selectedIds.indexOf(filterId), 1);
        } else {
            selectFilter.selectedIds.push(filterId);
        }
        selectedFilters[this.state.currentFilterType] = selectFilter;

        this.setState({ selectedFilters, hasChanged: true });
    }

    @autobind
    private _applyFilters() {
        // Apply filter query param
        let queryString = Object.keys(this.state.selectedFilters).reduce((result, filterType) => {
            let filterParams = "";
            const selectedFilter = this.state.selectedFilters[filterType];
            if (isRangeValueFilter(selectedFilter)) {
                filterParams += `price_high=${selectedFilter.maxValue}`;
                filterParams += `&price_low=${selectedFilter.minValue}`;
            } else if (isTreeSelectFilter(selectedFilter)) {
                selectedFilter.selectedTree.categories = this.state.filters[FilterType.CATEGORY];
                filterParams = `categories=${selectedFilter.selectedTree.getQueryString()}`;
            } else {
                const selectedIds = selectedFilter.selectedIds.filter(id => id !== "").join(",");
                if (selectedIds.length === 0) return result;

                filterParams = `${filterType.toLowerCase()}=${selectedFilter.selectedIds.join(",")}`;
            }
            return `${result}${result.length !== 0 ? "&" : ""}${filterParams}`;
        }, "");

        // Apply sort query param
        if (this.state.currentSortType !== SortType.RELEVANCE) {
            queryString += `${queryString.length === 0 ? "" : "&"}sort=${SortQueryParamMap[this.state.currentSortType]}`;
        }

        this.props.history.push({
            pathname: this.props.location.pathname,
            search: `?${queryString}`,
        });
    }

    @autobind
    private _selectFilterType(filterType: FilterType | null) {
        this.setState({
            currentFilterType: filterType,
            currentCategory: filterType === FilterType.CATEGORY && this.state.filters[filterType] ? [this.state.filters[filterType].find(c => c.id === "70668ef0-7a13-41b1-8cda-c28b67e8098a")] : null,
        });
    }

    private _toggleCategory = (category: Category) => {
        let selectedFilters = this.state.selectedFilters;
        let tree = selectedFilters[this.state.currentFilterType] || new TreeSelectFilter;
        tree.selectedTree.toggleCategory(category);
        selectedFilters[this.state.currentFilterType] = tree;
        this.setState({ selectedFilters, hasChanged: true });
    }

    private _selectCurrentCategory = (category: Category | null) => {
        let currentCategory = this.state.currentCategory;
        if (category) {
            currentCategory.push(category);
        } else {
            currentCategory.pop();
        }
        if (currentCategory.length === 0) {
            this.setState({ currentCategory: null, currentFilterType: null });
        } else {
            this.setState({ currentCategory });
        }
    }

    @autobind
    private _selectSortType(sortType: SortType) {
        this.setState({ currentSortType: sortType }, () => this._applyFilters());
    }

    private _getFilterTypes(contentType: ContentType | UserContentType) {
        // The goal here is to make this service driven so that we don't need to make changes here if we want to add new filter categories
        switch (contentType) {
            case ContentType.POST:
            case ContentType.PRODUCT:
                return [
                    { type: FilterType.CATEGORY, category: FilterCategory.TREE_SELECT } as FilterOption,
                    { type: FilterType.BRANDS, category: FilterCategory.SEARCH } as FilterOption,
                    { type: FilterType.PRICE_RANGE, category: FilterCategory.RANGE} as FilterOption,
                    { type: FilterType.RETAILER, category: FilterCategory.SEARCH } as FilterOption,
                    { type: FilterType.TAGS, category: FilterCategory.SEARCH } as FilterOption,
                ];
            case ContentType.SHOP:
                return [
                    { type: FilterType.BRANDS, category: FilterCategory.SEARCH } as FilterOption,
                    { type: FilterType.PRICE_RANGE, category: FilterCategory.RANGE} as FilterOption,
                    { type: FilterType.RETAILER, category: FilterCategory.SEARCH } as FilterOption,
                    { type: FilterType.TAGS, category: FilterCategory.SEARCH } as FilterOption,
                ];
            default:
                throw new Error(`Filter not supported for content type ${contentType}`);
        }
    }

    @autobind
    private _getSortTypes() {
        // Update once we have different sort types by context
        if (this.props.loggedIn) {
            return [
                SortType.RELEVANCE,
                SortType.LATEST,
                SortType.POPULARITY,
                SortType.PRICE_HIGH_TO_LOW,
                SortType.PRICE_LOW_TO_HIGH,
            ];
        }

        return [
            SortType.LATEST,
            SortType.POPULARITY,
            SortType.PRICE_HIGH_TO_LOW,
            SortType.PRICE_LOW_TO_HIGH,
        ];
    }
}

ContentToolbar.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
