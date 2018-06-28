import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { FilterSearchResult } from "../../../api/models";
import { AppContext, AppContextTypes } from "../../../app";
import { ContentType } from "../../model";
import RouteProps from "../../routeProps";
import MobileContentToolbar from "./mobile";
import { Filter, FilterCategory, FilterOption, FilterQueryParamMap, FilterType, RangeValueFilter, SelectFilter, SortFilter, SortQueryParamMap, SortType, ToolbarType } from "./types";

import "./style.scss";

interface ContentToolbarProps extends RouteProps {
    className?: string;
    // sortType: SortType;
    contentType: ContentType;
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
            className,
            contentType,
            setGridSize,
        } = this.props;

        return (
            <div>
                <BrowserView device={isBrowser}>
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileContentToolbar
                        {...this.state}
                        selectFilterType={this._selectFilterType}
                        selectSortType={this._selectSortType}
                        toggleSelectFilterItem={this._toggleSelectFilterItem}
                        toggleActiveToolbar={this._toggleActiveToolbar}
                        onSearchStringChange={this._onSearchStringChange}
                        removeFilterItem={this._removeFilterItem}
                        setGridSize={setGridSize}
                    />
                </MobileView>
            </div>
        );
    }

    private _searchTimeout: any;

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
            const filterContent = await this._getFilterContent(filterOption.type, this.state.searchString);
            filters[filterOption.type] = filterContent;
        }

        // Update selectedFilters
        const selectedFilters = this.state.selectedFilters;
        let sortType = this.state.currentSortType;
        if (location.search) {
            const queryParams = location.search.slice(1).split("&");
            queryParams.forEach(queryParam => {
                const [filterType, values] = queryParam.split("=");
                if (filterType.toLowerCase() === "sort") {
                    sortType = SortQueryParamMap[values.toLowerCase()];
                } else {
                    selectedFilters[FilterQueryParamMap[filterType]] = { selectedIds: values.split(",") } as SelectFilter;
                }
            });
        }
        this.setState({ filters, selectedFilters, currentSortType: sortType });
    }

    @autobind
    private _getFilterContent(filterType: FilterType, query?: string) {
        switch (filterType) {
            case FilterType.BRANDS:
                return this.context.api.getBrands(query);
            case FilterType.CATEGORY:
            case FilterType.PRICE_RANGE:
                return [];
            case FilterType.RETAILER:
                return this.context.api.getRetailers(query);
            case FilterType.TAGS:
                return this.context.api.getTags(query);
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
            if (selectedFilters[filterType].selectedIds.some(filter => filter.id === filterId)) {
                selectedFilters[filterType] = selectedFilters[filterType].filter(filter => filter.id !== filterId);
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
            const temp = this.state.selectedFilters[filterType].selectedIds.join(",");
            if (temp.length === 0) {
                return result;
            }
            return `${result}${result.length !== 0 ? "&" : ""}${FilterQueryParamMap[filterType]}=${temp}`;
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
        this.setState({ currentFilterType: filterType });
    }

    @autobind
    private _selectSortType(sortType: SortType) {
        this.setState({ currentSortType: sortType }, () => this._applyFilters());
    }

    private _getFilterTypes(contentType: ContentType) {
        // The goal here is to make this service driven so that we don't need to make changes here if we want to add new filter categories
        switch (contentType) {
            case ContentType.POST:
            case ContentType.PRODUCT:
                return [
                    { type: FilterType.CATEGORY, category: FilterCategory.SEARCH } as FilterOption,
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

    private _getSortTypes() {
        // Update once we have different sort types by context
        return [
            SortType.RELEVANCE,
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
