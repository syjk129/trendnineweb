import autobind from "autobind-decorator";
import * as React from "react";
import { render } from "react-dom";

import { FilterSearchResult } from "../../../../api/models";
import Checkbox from "../../../../components/checkbox";
import { Filter, FilterType } from "../types";

import "./style.scss";

interface FilterViewProps {
    currentFilterType: FilterType | null;
    selectedFilters: Map<FilterType, Filter>;
    filterTypes: Array<FilterType>;
    filters: Map<FilterType, Array<FilterSearchResult>>;
    selectFilterType(filterType: FilterType | null): void;
    toggleSelectFilterItem(filterId: string): void;
    toggleFilterActive(): void;
}

interface ListItemProps {
    label: string;
    onClick?(): void;
}

class ListItem extends React.Component<ListItemProps> {
    render() {
        return (
            <div className="list-item" onClick={this.props.onClick}>
                {this.props.label}
            </div>
        );
    }
}

export default class FilterView extends React.Component<FilterViewProps> {
    render() {
        const {
            currentFilterType,
            selectedFilters,
            filterTypes,
            filters,
            selectFilterType,
            toggleSelectFilterItem,
            toggleFilterActive,
        } = this.props;

        return (
            <div className="mobile-filter">
                {!currentFilterType && filterTypes.map(filterType => (
                    <ListItem label={filterType} onClick={() => selectFilterType(filterType)} />
                ))}
                {currentFilterType && (
                    <div>
                        <ListItem label={currentFilterType} onClick={() => selectFilterType(null)} />
                        {filters[currentFilterType].map(filterSearchResult => (
                            <Checkbox
                                value={filterSearchResult.id}
                                label={filterSearchResult.name}
                                checked={this._isFilterSearchResultChecked(filterSearchResult)}
                                onChange={() => toggleSelectFilterItem(filterSearchResult.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    @autobind
    private _isFilterSearchResultChecked(filterSearchResult: FilterSearchResult) {
        if (this.props.selectedFilters[this.props.currentFilterType]) {
            return this.props.selectedFilters[this.props.currentFilterType].selectedIds.includes(filterSearchResult.id);
        }
        return false;
    }
}
