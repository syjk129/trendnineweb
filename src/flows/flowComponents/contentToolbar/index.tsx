import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { FilterSearchResult } from "../../../api/models";
import { AppContext, AppContextTypes } from "../../../app";
import { ContentType } from "../../model";
import RouteProps from "../../routeProps";
import MobileContentToolbar from "./mobile";
import { Filter, FilterCategory, FilterOption, FilterQueryParamMap, FilterType, RangeValueFilter, SelectFilter } from "./types";

import "./style.scss";


interface ContentToolbarProps extends RouteProps {
    className?: string;
    // sortType: SortType;
    contentType: ContentType;
    setGridSize?(size: number): void;
    // setSortType(sortType: SortType): void;
}

interface ContentToolbarState {
    isActive: boolean;
    hasChanged: boolean;
    filterOptions: Array<FilterOption>;
    filters: Map<FilterType, Array<FilterSearchResult>>;
    selectedFilters: Map<FilterType, Filter>;
    currentFilterType: FilterType | null;
    searchString: string;
}

export default class ContentToolbar extends React.Component<ContentToolbarProps, ContentToolbarState> {
    static contextTypes: AppContext;

    state: ContentToolbarState = {
        isActive: false,
        hasChanged: false,
        filterOptions: this._getFilterTypes(this.props.contentType),
        filters: new Map(),
        selectedFilters: new Map(),
        currentFilterType: null,
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
                        toggleSelectFilterItem={this._toggleSelectFilterItem}
                        toggleFilterActive={this._toggleFilterActive}
                        onSearchStringChange={this._onSearchStringChange}
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
        this.state.filterOptions.forEach(async filterOption => {
            const filterContent = await this._getFilterContent(filterOption.type, this.state.searchString);
            filters[filterOption.type] = filterContent;
        });

        // Update selectedFilters
        const selectedFilters = this.state.selectedFilters;
        if (location.search) {
            const queryParams = location.search.slice(1).split("&");
            queryParams.forEach(queryParam => {
                const [filterType, values] = queryParam.split("=");
                selectedFilters[FilterQueryParamMap[filterType]] = { selectedIds: values.split(",") } as SelectFilter;
            });
        }

        this.setState({ filters, selectedFilters });
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
    private _toggleFilterActive() {
        if (this.state.isActive && this.state.hasChanged) {
            const queryString = Object.keys(this.state.selectedFilters).reduce((result, filterType) => {
                const temp = this.state.selectedFilters[filterType].selectedIds.join(",");
                if (temp.length === 0) {
                    return result;
                }
                return `${result}${result.length !== 0 ? "&" : ""}${FilterQueryParamMap[filterType]}=${temp}`;
            }, "");
            this.props.history.push({
                pathname: this.props.location.pathname,
                search: `?${queryString}`,
            });
        }
        this.setState({ isActive: !this.state.isActive, hasChanged: false });
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
    private _selectFilterType(filterType: FilterType | null) {
        this.setState({ currentFilterType: filterType });
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
}

ContentToolbar.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};
