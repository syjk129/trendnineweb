import { Range } from "rc-slider";
import * as React from "react";

import { FilterSearchResult } from "../../../../api/models";
import Checkbox from "../../../../components/checkbox";
import Input from "../../../../components/input";
import { ListContainer, ListItem } from "../list";
import { Filter, FilterCategory, FilterOption, FilterType } from "../types";

import "./style.scss";

interface FilterViewProps {
    currentFilterType: FilterType | null;
    selectedFilters: Map<FilterType, Filter>;
    filterOptions: Array<FilterOption>;
    filters: Map<FilterType, Array<FilterSearchResult>>;
    searchString: string;
    selectFilterType(filterType: FilterType | null): void;
    toggleSelectFilterItem(filterId: string): void;
    toggleFilterActive(): void;
    onRangeFilterChange(min: number, max: number): void;
    onSearchStringChange(searchString: string): void;
}

export default class FilterView extends React.Component<FilterViewProps> {
    render() {
        const {
            currentFilterType,
            filterOptions,
            selectFilterType,
            selectedFilters,
        } = this.props;

        return (
            <ListContainer>
                {!currentFilterType && filterOptions.map(filterOption => (
                    <ListItem label={filterOption.type} onClick={() => selectFilterType(filterOption.type)} />
                ))}
                {currentFilterType && this._renderFilterSearch()}
            </ListContainer>
        );
    }

    private _renderFilterSearch = () => {
        const {
            currentFilterType,
            filterOptions,
            selectedFilters,
            filters,
            selectFilterType,
            toggleSelectFilterItem,
        } = this.props;

        const filterOption = filterOptions.find(filterOption => filterOption.type === currentFilterType);
        switch (filterOption.category) {
            case FilterCategory.SEARCH:
                return (
                    <div className="filter-search-container">
                        <ListItem label={currentFilterType} open onClick={() => selectFilterType(null)} />
                        <div className="filter-search">
                            <Input
                                placeholder={`Search for ${currentFilterType}`}
                                value={this.props.searchString}
                                onChange={this.props.onSearchStringChange}
                            />
                        </div>
                        <div className="filter-search-results">
                            {filters[currentFilterType].map(filterSearchResult => (
                                <Checkbox
                                    value={filterSearchResult.id}
                                    label={filterSearchResult.name}
                                    checked={this._isFilterSearchResultChecked(filterSearchResult)}
                                    onChange={() => toggleSelectFilterItem(filterSearchResult.id)}
                                />
                            ))}
                        </div>
                    </div>
                );
            case FilterCategory.RANGE:
                return (
                    <div className="filter-search-container">
                        <ListItem label={currentFilterType} open onClick={() => selectFilterType(null)} />
                        <div className="filter-results">
                            <div className="range-label">
                                <span>
                                    ${selectedFilters[currentFilterType] && selectedFilters[currentFilterType].minValue || 0}
                                </span>
                                <span>
                                    ${selectedFilters[currentFilterType] && selectedFilters[currentFilterType].maxValue || 5000}
                                </span>
                            </div>
                            <Range
                                min={0}
                                max={5000}
                                step={10}
                                allowCross={false}
                                value={[
                                    selectedFilters[currentFilterType] && selectedFilters[currentFilterType].minValue || 0,
                                    selectedFilters[currentFilterType] && selectedFilters[currentFilterType].maxValue || 5000,
                                ]}
                                onChange={this._onRangeFilterChange}
                            />
                        </div>
                    </div>
                );
        }
    }

    private _onRangeFilterChange = (value: Array<number>) => {
        return this.props.onRangeFilterChange(value[0], value[1]);
    }

    private _isFilterSearchResultChecked = (filterSearchResult: FilterSearchResult) => {
        if (this.props.selectedFilters[this.props.currentFilterType]) {
            return this.props.selectedFilters[this.props.currentFilterType].selectedIds.includes(filterSearchResult.id);
        }
        return false;
    }
}
