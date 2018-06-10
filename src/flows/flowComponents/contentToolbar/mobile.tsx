import autobind from "autobind-decorator";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { FilterSearchResult } from "../../../api/models";
import { IconButton } from "../../../components/button";
import Icon, { IconSize, IconVariant } from "../../../components/icon";
import Sticky from "../../../components/sticky";
import FilterView from "./filter";
import { Filter, FilterType } from "./types";

interface MobileContentToolbarProps {
    isActive: boolean;
    currentFilterType: FilterType | null;
    selectedFilters: Map<FilterType, Filter>;
    filterTypes: Array<FilterType>;
    filters: Map<FilterType, Array<FilterSearchResult>>;
    setGridSize(size: number): void;
    selectFilterType(filterType: FilterType | null): void;
    toggleSelectFilterItem(filterId: string): void;
    toggleFilterActive(): void;
}

export default class MobileContentToolbar extends React.Component<MobileContentToolbarProps> {
    componentDidMount() {
        this._toolbarElement = document.getElementById("mobile-content-toolbar");
        this._offsetTop = document.getElementById("mobile-content-toolbar").offsetTop;
        window.addEventListener("scroll", this._onScroll, false);
    }

    render() {
        const {
            isActive,
            currentFilterType,
            selectedFilters,
            filterTypes,
            filters,
            selectFilterType,
            toggleSelectFilterItem,
            toggleFilterActive,
        } = this.props;

        return (
            <div className="mobile-content-toolbar" id="mobile-content-toolbar">
                <div className="toolbar">
                    <div onClick={toggleFilterActive}>
                        Filter
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
                        filterTypes={filterTypes}
                        filters={filters}
                        selectFilterType={selectFilterType}
                        toggleSelectFilterItem={toggleSelectFilterItem}
                        toggleFilterActive={toggleFilterActive}
                    />
                }
            </div>
        );
    }

    private _offsetTop: number;
    private _toolbarElement: HTMLElement;

    @autobind
    private _onScroll() {
        const navbarHeight = 60;
        if (window.pageYOffset + navbarHeight > this._offsetTop) {
            this._toolbarElement.classList.add("sticky");
        } else {
            this._toolbarElement.classList.remove("sticky");
        }
    }
}
