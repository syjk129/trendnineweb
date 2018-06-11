import autobind from "autobind-decorator";
import * as React from "react";
import { render } from "react-dom";

import { FilterSearchResult } from "../../../../api/models";
import Checkbox from "../../../../components/checkbox";
import Icon, { IconVariant } from "../../../../components/icon";
import Input from "../../../../components/input";
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
    onSearchStringChange(searchString: string): void;
    onSearch(): void;
}

interface ListItemProps {
    label: string;
    open?: boolean;
    onClick?(): void;
}

class ListItem extends React.Component<ListItemProps> {
    render() {
        return (
            <div className="list-item" onClick={this.props.onClick}>
                <span className="label">{this.props.label}</span>
                <div><Icon variant={this.props.open ? IconVariant.ARROW_LEFT : IconVariant.ARROW_RIGHT} /></div>
            </div>
        );
    }
}

export default class FilterView extends React.Component<FilterViewProps> {
    render() {
        const {
            currentFilterType,
            selectedFilters,
            filterOptions,
            filters,
            selectFilterType,
            toggleSelectFilterItem,
            toggleFilterActive,
        } = this.props;

        return (
            <div className="mobile-filter">
                {!currentFilterType && filterOptions.map(filterOption => (
                    <ListItem label={filterOption.type} onClick={() => selectFilterType(filterOption.type)} />
                ))}
                {currentFilterType && this._renderFilterSearch()}
            </div>
        );
    }

    @autobind
    private _renderFilterSearch() {
        const {
            currentFilterType,
            selectedFilters,
            filterOptions,
            filters,
            selectFilterType,
            toggleSelectFilterItem,
            toggleFilterActive,
        } = this.props;

        const filterOption = filterOptions.find(filterOption => filterOption.type === currentFilterType);
        switch (filterOption.category) {
            case FilterCategory.SEARCH:
                return (
                    <div className="filter-search-container">
                        <ListItem label={currentFilterType} open onClick={() => selectFilterType(null)} />
                        <div className="filter-search">
                            <Input
                                value={this.props.searchString}
                                onChange={this.props.onSearchStringChange}
                                onEnterPress={this.props.onSearch}
                            />
                        </div>
                        <div className="filter-results">
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
                return null;
        }
    }

    @autobind
    private _isFilterSearchResultChecked(filterSearchResult: FilterSearchResult) {
        if (this.props.selectedFilters[this.props.currentFilterType]) {
            return this.props.selectedFilters[this.props.currentFilterType].selectedIds.includes(filterSearchResult.id);
        }
        return false;
    }
}
