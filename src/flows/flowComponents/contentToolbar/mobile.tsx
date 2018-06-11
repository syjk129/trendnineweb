import autobind from "autobind-decorator";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { FilterSearchResult } from "../../../api/models";
import { IconButton } from "../../../components/button";
import Icon, { IconSize, IconVariant } from "../../../components/icon";
import Sticky from "../../../components/sticky";
import FilterView from "./filter";
import { Filter, FilterOption, FilterType } from "./types";

interface MobileContentToolbarProps {
    isActive: boolean;
    currentFilterType: FilterType | null;
    selectedFilters: Map<FilterType, Filter>;
    filterOptions: Array<FilterOption>;
    filters: Map<FilterType, Array<FilterSearchResult>>;
    searchString: string;
    setGridSize(size: number): void;
    selectFilterType(filterType: FilterType | null): void;
    toggleSelectFilterItem(filterId: string): void;
    toggleFilterActive(): void;
    onSearchStringChange(searchString: string): void;
    onSearch(): void;
}

interface MobileContentToolbarState {
    stickyAdded: boolean;
}

export default class MobileContentToolbar extends React.Component<MobileContentToolbarProps, MobileContentToolbarState> {
    state: MobileContentToolbarState = {
        stickyAdded: false,
    };

    render() {
        const {
            isActive,
            currentFilterType,
            selectedFilters,
            filterOptions,
            filters,
            searchString,
            selectFilterType,
            toggleSelectFilterItem,
            toggleFilterActive,
            onSearch,
            onSearchStringChange,
        } = this.props;

        return (
            <Sticky id="mobile-content-toolbar" stickyClassName="sticky-mobile-content-toolbar">
                <div className="toolbar">
                    <div className="filter-toggle" onClick={this._toggleFilterActive}>
                        <span className="filter-toggle-label">Filter</span>
                        <Icon variant={IconVariant.PLUS_OPEN} selected={this.props.isActive} />
                    </div>
                    <div className="grid-sizes">
                        <IconButton
                            icon={IconVariant.GRID_SIZE_1}
                            size={IconSize.SMALL}
                            onClick={() => this.props.setGridSize(1)}
                        />
                        <IconButton
                            icon={IconVariant.GRID_SIZE_2}
                            size={IconSize.SMALL}
                            onClick={() => this.props.setGridSize(2)}
                        />
                        <IconButton
                            icon={IconVariant.GRID_SIZE_3}
                            size={IconSize.SMALL}
                            onClick={() => this.props.setGridSize(3)}
                        />
                   </div>
                </div>
                {isActive &&
                    <FilterView
                        currentFilterType={currentFilterType}
                        selectedFilters={selectedFilters}
                        filterOptions={filterOptions}
                        filters={filters}
                        searchString={searchString}
                        selectFilterType={selectFilterType}
                        toggleSelectFilterItem={toggleSelectFilterItem}
                        toggleFilterActive={this._toggleFilterActive}
                        onSearch={onSearch}
                        onSearchStringChange={onSearchStringChange}
                    />
                }
            </Sticky>
        );
    }

    private _offsetTop: number;
    private _toolbarElement: HTMLElement;

    @autobind
    private _toggleFilterActive() {
        // Add sticky classname when filter opens and its not already sticky
        const contentToolbar = document.getElementById("mobile-content-toolbar");

        if (this.props.isActive) {
            if (this.state.stickyAdded && contentToolbar.classList.contains("sticky-mobile-content-toolbar")) {
                contentToolbar.classList.remove("sticky-mobile-content-toolbar");
                this.setState({ stickyAdded: false });
            }
            contentToolbar.classList.remove("filter-open");
        } else {
            if (!contentToolbar.classList.contains("sticky-mobile-content-toolbar")) {
                contentToolbar.classList.add("sticky-mobile-content-toolbar");
                this.setState({ stickyAdded: true });
            }
            contentToolbar.classList.add("filter-open");
        }

        // Make html and body not scrollable while filter is open
        if (!this.props.isActive) {
            document.body.classList.add("noscroll");
        } else {
            document.body.classList.remove("noscroll");
        }

        return this.props.toggleFilterActive();
    }
}
