import autobind from "autobind-decorator";
import * as React from "react";

import { Category, FilterSearchResult } from "../../../api/models";
import Button, { IconButton } from "../../../components/button";
import Checkbox from "../../../components/checkbox";
import Icon, { IconSize, IconVariant } from "../../../components/icon";
import Sticky from "../../../components/sticky";
import { noScroll, removeNoScroll } from "../../../util/scroll";
import FilterView from "./filter";
import SortView from "./sort";
import { Filter, FilterOption, FilterType, isSelectFilter, SortType, ToolbarType } from "./types";

interface MobileContentToolbarProps {
    activeToolbar: ToolbarType | null;
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
    toggleCategory(category: Category): void;
    selectSortType(sortType: SortType): void;
    toggleSelectFilterItem(filterId: string): void;
    toggleActiveToolbar(toolbarType: ToolbarType | null): void;
    removeFilterItem(filterId: string): void;
    onRangeFilterChange(min: number, max: number): void;
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
            clearFilters,
        } = this.props;

        return (
            <Sticky id="mobile-content-toolbar" stickyClassName="sticky-mobile-content-toolbar">
                <div className="toolbar">
                    <div className="filter-toggle" onClick={() => this._toggleFilterActive(ToolbarType.FILTER)}>
                        <span className="filter-toggle-label">Filter</span>
                        <Icon variant={IconVariant.ARROW_DOWN} selected={activeToolbar === ToolbarType.FILTER} />
                    </div>
                    <div className="filter-toggle" onClick={() => this._toggleFilterActive(ToolbarType.SORT)}>
                        <span className="filter-toggle-label">Sort</span>
                        <Icon variant={IconVariant.ARROW_DOWN} selected={activeToolbar === ToolbarType.SORT} />
                    </div>
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
                        <IconButton
                            className={gridSize === 3 ? "selected" : ""}
                            icon={IconVariant.GRID_SIZE_3}
                            size={IconSize.SMALL}
                            onClick={() => this.props.setGridSize(3)}
                        />
                   </div>
                </div>
                {activeToolbar === ToolbarType.SORT &&
                    <SortView
                        sortTypes={sortTypes}
                        currentSortType={currentSortType}
                        selectSortType={this._selectSortType}
                    />
                }
                {activeToolbar === ToolbarType.FILTER &&
                    <>
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
                            clearFilters={this._clearFilters}
                        />
                        <div className="filter-toolbar">
                            <Button rounded onClick={() => this._toggleFilterActive(this.props.activeToolbar)}>Apply</Button>
                        </div>
                    </>
                }
                {/* {filters && Object.keys(filters).length > 0 && (
                    <div className="active-filters">
                        {Object.keys(selectedFilters).map(filterType => this._renderFilterChips(filterType as FilterType))}
                    </div>
                )} */}
            </Sticky>
        );
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
    private _renderFilterChips(filterType: FilterType) {
        const filter = this.props.selectedFilters[filterType];
        if (filter && isSelectFilter(filter) && this.props.filters[filterType]) {
            return filter.selectedIds.map(selectedId => {
                const filterItem = this.props.filters[filterType].find(filterItem => filterItem.id === selectedId);
                if (filterItem) {
                    return <Checkbox label={filterItem.name} checked value={filterItem.id} onChange={() => this.props.removeFilterItem(filterItem.id)} />;
                }
            });
        }
    }

    @autobind
    private _toggleFilterActive(toolbarType: ToolbarType) {
        // Add sticky classname when filter opens and its not already sticky
        const contentToolbar = document.getElementById("mobile-content-toolbar");

        if (this.props.activeToolbar && this.props.activeToolbar === toolbarType) {
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
        if (!this.props.activeToolbar) {
            noScroll();
        } else {
            removeNoScroll();
        }

        return this.props.toggleActiveToolbar(toolbarType);
    }
}
