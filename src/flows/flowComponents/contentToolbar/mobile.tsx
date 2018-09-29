import autobind from "autobind-decorator";
import * as React from "react";

import { Category, FilterSearchResult } from "../../../api/models";
import Button, { ButtonVariant, IconButton } from "../../../components/button";
import Chip from "../../../components/chip";
import { IconSize, IconVariant } from "../../../components/icon";
import Modal from "../../../components/modal";
import Sticky from "../../../components/sticky";
import { noScroll, removeNoScroll } from "../../../util/scroll";
import { findCategory } from "../../shopDiscover/category-tree";
import FilterView from "./filter";
import FilterNavigation from "./filterNavigation";
import SortView from "./sort";
import { Filter, FilterCategory, FilterOption, FilterType, SortType, ToolbarType } from "./types";

interface MobileContentToolbarProps {
    activeToolbar: ToolbarType | null;
    hasChanged: boolean;
    currentFilterType: FilterType | null;
    currentSortType: SortType;
    currentCategory: Array<Category> | null;
    selectedFilters: Map<FilterType, Filter>;
    filterOptions: Array<FilterOption>;
    sortTypes: Array<SortType>;
    gridSize: number;
    filters: Map<FilterType, Array<FilterSearchResult>>;
    searchString: string;
    setGridSize(size: number): void;
    selectFilterType(filterType: FilterType | null): void;
    selectCurrentCategory(category: Category | null): void;
    toggleCategory(category: Category, filterType?: FilterType): void;
    removeCategory(categoryId: string): void;
    selectSortType(sortType: SortType): void;
    toggleSelectFilterItem(filterId: string, filterType?: FilterType): void;
    toggleActiveToolbar(toolbarType: ToolbarType | null): void;
    removeFilterItem(filterId: string): void;
    onRangeFilterChange(min?: number, max?: number): void;
    onSearchStringChange(searchString: string): void;
    clearFilters(): void;
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
            activeToolbar,
            gridSize,
            currentFilterType,
            currentSortType,
            currentCategory,
            hasChanged,
            selectedFilters,
            filterOptions,
            sortTypes,
            filters,
            searchString,
            selectFilterType,
            selectCurrentCategory,
            toggleCategory,
            toggleSelectFilterItem,
            onRangeFilterChange,
            onSearchStringChange,
        } = this.props;

        return (
            <Sticky id="mobile-content-toolbar" stickyClassName="sticky-mobile-content-toolbar">
                <div className="toolbar">
                    <Button
                        className="toolbar-button"
                        rounded
                        variant={ButtonVariant.OUTLINE}
                        onClick={() => this._toggleFilterActive(ToolbarType.FILTER)}
                    >
                        FILTER
                    </Button>
                    <Button
                        className="toolbar-button"
                        rounded
                        variant={ButtonVariant.OUTLINE}
                        onClick={() => this._toggleFilterActive(ToolbarType.SORT)}
                    >
                        SORT
                    </Button>
                    <div className="grid-sizes">
                        <IconButton
                            className={gridSize === 1 ? "selected" : ""}
                            icon={IconVariant.GRID_SIZE_1}
                            size={IconSize.SMALL}
                            onClick={() => this.props.setGridSize(1)}
                        />
                        <IconButton
                            className={gridSize === 2 ? "selected" : ""}
                            icon={IconVariant.GRID_SIZE_2}
                            size={IconSize.SMALL}
                            onClick={() => this.props.setGridSize(2)}
                        />
                   </div>
                </div>
                {activeToolbar === ToolbarType.SORT &&
                    <Modal isOpen={activeToolbar === ToolbarType.SORT} fullScreen hideClose close={() => this._toggleFilterActive(activeToolbar)}>
                        <FilterNavigation
                            title="Sort"
                            onClose={() => this._toggleFilterActive(ToolbarType.SORT)}
                        >
                            <SortView
                                sortTypes={sortTypes}
                                currentSortType={currentSortType}
                                selectSortType={this._selectSortType}
                            />
                        </FilterNavigation>
                    </Modal>
                }
                {activeToolbar === ToolbarType.FILTER &&
                    <Modal isOpen={activeToolbar === ToolbarType.FILTER} fullScreen hideClose close={() => this._toggleFilterActive(activeToolbar)}>
                        <FilterNavigation
                            title={currentCategory ? currentCategory.slice(-1)[0].display_name : "Filter"}
                            onBack={this._navigationBackHandler()}
                            onClose={() => this._toggleFilterActive(this.props.activeToolbar)}
                            clearFilter={this._clearFilters}
                        >
                            {!currentFilterType && Object.keys(this.props.selectedFilters).length > 0 && (
                                <div className="filter-chips">
                                    {Object.keys(this.props.selectedFilters).map((selectedFilter: FilterType) => (
                                        this._renderFilterChip(selectedFilter)
                                    ))}
                                </div>
                            )}
                            <FilterView
                                currentFilterType={currentFilterType}
                                currentCategory={currentCategory}
                                selectedFilters={selectedFilters}
                                filterOptions={filterOptions}
                                filters={filters}
                                searchString={searchString}
                                selectFilterType={selectFilterType}
                                selectCurrentCategory={selectCurrentCategory}
                                toggleCategory={toggleCategory}
                                toggleSelectFilterItem={toggleSelectFilterItem}
                                toggleFilterActive={() => this._toggleFilterActive(ToolbarType.FILTER)}
                                onRangeFilterChange={onRangeFilterChange}
                                onSearchStringChange={onSearchStringChange}
                            />
                            {hasChanged && (
                                <div className="filter-toolbar">
                                    <Button variant={ButtonVariant.OUTLINE} onClick={() => this._toggleFilterActive(this.props.activeToolbar)}>View Results</Button>
                                </div>
                            )}
                        </FilterNavigation>
                    </Modal>
                }
            </Sticky>
        );
    }

    private _renderFilterChip = (filterType: FilterType) => {
        const filter = this.props.selectedFilters[filterType];
        switch (filterType) {
            case FilterType.CATEGORY:
                filter.selectedTree.categories = this.props.filters[FilterType.CATEGORY];
                return filter.selectedTree.getSanitizedCategories().map(selectedFilter => {
                    const category = findCategory(selectedFilter, this.props.filters[FilterType.CATEGORY]);
                    return (
                        <Chip label={selectedFilter} remove={() => this.props.toggleCategory(category, FilterType.CATEGORY)}/>
                    );
                });
            case FilterType.BRANDS:
                return filter.selectedIds.map(selectedBrand => (
                    <Chip label={this._getFilterName(selectedBrand, FilterType.BRANDS)} remove={() => this.props.toggleSelectFilterItem(selectedBrand, FilterType.BRANDS)} />
                ));
            case FilterType.RETAILER:
                return filter.selectedIds.map(selectedRetailer => (
                    <Chip label={this._getFilterName(selectedRetailer, FilterType.RETAILER)} remove={() => this.props.toggleSelectFilterItem(selectedRetailer, FilterType.RETAILER)} />
                ));
            case FilterType.PRICE_RANGE:
                let priceRangeText = "";
                if (filter.minValue && (!filter.maxValue || filter.maxValue === 5000)) {
                    priceRangeText = `Price: $${filter.minValue}+`;
                } else if (filter.maxValue && (!filter.minValue || filter.minValue === 0)) {
                    priceRangeText = `Price: $0 - $${filter.maxValue}`;
                } else {
                    priceRangeText = `Price: $${filter.minValue} - $${filter.maxValue}`;
                }
                return (
                    <Chip label={priceRangeText} remove={() => this.props.onRangeFilterChange()} />
                );
        }
    }

    private _getFilterName = (selectedId: string, filterType: FilterType) => {
        const filters = this.props.filters[filterType];
        return filters.find(item => item.id === selectedId).name;
    }

    private _navigationBackHandler = () => {
        const filterOption = this.props.filterOptions.find(filterOption => filterOption.type === this.props.currentFilterType);
        if (filterOption) {
            switch (filterOption.category) {
                case FilterCategory.SEARCH:
                    return () => this.props.selectFilterType(null);
                case FilterCategory.RANGE:
                    return () => this.props.selectFilterType(null);
                case FilterCategory.TREE_SELECT:
                    if (!this.props.currentCategory) {
                        return null;
                    }
                    return () => this.props.selectCurrentCategory(null);
            }
        }
        return null;
    }

    private _clearFilters = () => {
        removeNoScroll();
        this.props.clearFilters();
    }

    private _selectSortType = (sortType: SortType) => {
        removeNoScroll();
        this.props.selectSortType(sortType);
    }

    @autobind
    private _toggleFilterActive(toolbarType: ToolbarType) {
        // Add sticky classname when filter opens and its not already sticky
        const contentToolbar = document.getElementById("mobile-content-toolbar");
        const stickyPlaceholder = document.getElementById("sticky-placeholder");

        if (this.props.activeToolbar && this.props.activeToolbar === toolbarType) {
            if (this.state.stickyAdded && contentToolbar.classList.contains("sticky-mobile-content-toolbar")) {
                contentToolbar.classList.remove("sticky-mobile-content-toolbar");
                this.setState({ stickyAdded: false });
            }
            stickyPlaceholder.classList.add("hidden");
        } else {
            if (!contentToolbar.classList.contains("sticky-mobile-content-toolbar")) {
                contentToolbar.classList.add("sticky-mobile-content-toolbar");
                this.setState({ stickyAdded: true });
            }
            stickyPlaceholder.classList.remove("hidden");
        }

        // Make html and body not scrollable while filter is open
        if (!this.props.activeToolbar) {
            noScroll();
        } else {
            removeNoScroll();
        }

        return this.props.toggleActiveToolbar(toolbarType);
    }
}
