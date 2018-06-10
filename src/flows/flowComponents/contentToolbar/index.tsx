import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { FilterSearchResult } from "../../../api/models";
import { AppContext, AppContextTypes } from "../../../app";
import { ContentType } from "../../model";
import MobileContentToolbar from "./mobile";
import { Filter, FilterType, RangeValueFilter, SelectFilter } from "./types";

import "./style.scss";


interface ContentToolbarProps {
    className?: string;
    // sortType: SortType;
    selectedFilters: Map<FilterType, Filter>;
    contentType: ContentType;
    setGridSize?(size: number): void;
    // setSortType(sortType: SortType): void;
    // setFilters(filters: Map<FilterType, Filter>): void;
}

interface ContentToolbarState {
    isActive: boolean;
    filterTypes: Array<FilterType>;
    filters: Map<FilterType, Array<FilterSearchResult>>;
    selectedFilters: Map<FilterType, Filter>;
    currentFilterType: FilterType | null;
    searchString: string;
}

export default class ContentToolbar extends React.Component<ContentToolbarProps, ContentToolbarState> {
    static contextTypes: AppContext;

    state: ContentToolbarState = {
        isActive: false,
        filterTypes: this._getFilterTypes(this.props.contentType),
        filters: new Map(),
        selectedFilters: this.props.selectedFilters,
        currentFilterType: null,
        searchString: "",
    };

    componentWillMount() {
        this._populateFilters();
    }

    render() {
        const {
            className,
            selectedFilters,
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
                        setGridSize={setGridSize}
                    />
                </MobileView>
            </div>
        );
    }

    @autobind
    private async _populateFilters() {
        const filters = this.state.filters;
        this.state.filterTypes.forEach(async filterType => {
            const filterContent = await this._getFilterContent(filterType, this.state.searchString);
            filters[filterType] = filterContent;
        });
        this.setState({ filters });
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
                throw new Error(`Unsupported filter type ${this.state.currentFilterType}`);
        }
    }

    @autobind
    private _toggleFilterActive() {
        this.setState({ isActive: !this.state.isActive });
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

        this.setState({ selectedFilters });
    }

    @autobind
    private _selectFilterType(filterType: FilterType | null) {
        this.setState({ currentFilterType: filterType });
    }

    private _getFilterTypes(contentType: ContentType) {
        switch (contentType) {
            case ContentType.POST:
            case ContentType.PRODUCT:
                return [
                    FilterType.CATEGORY,
                    FilterType.BRANDS,
                    FilterType.PRICE_RANGE,
                    FilterType.RETAILER,
                    FilterType.TAGS,
                ];
            case ContentType.SHOP:
                return [
                    FilterType.BRANDS,
                    FilterType.PRICE_RANGE,
                    FilterType.RETAILER,
                    FilterType.TAGS,
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
