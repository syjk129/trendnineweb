import * as React from "react";
import autobind from "autobind-decorator";

import { Person } from "../../../api/models";
import Button, { ButtonVariant } from "../../../components/button";
import Anchor, { AnchorVariant } from "../../../components/anchor";
import Icon, { IconVariant } from "../../../components/icon";

import "./style.scss";

interface FilterProps { }

interface FilterState {
    active: boolean;
    isCategoryActive: boolean;
    isBrandActive: boolean;
    isPriceRangeActive: boolean;
    isOnSaleActive: boolean;
    isNewArrivalsActive: boolean;
    isRetailerActive: boolean;
    isTagActive: boolean;
}

export default class Filter extends React.Component<FilterProps, FilterState> {
    state: FilterState = {
        active: false,
        isCategoryActive: false,
        isBrandActive: false,
        isPriceRangeActive: false,
        isOnSaleActive: false,
        isNewArrivalsActive: false,
        isRetailerActive: false,
        isTagActive: false,
    };

    render() {
        let filterMap = {
            "CATEGORY": "isCategoryActive",
            "BRAND": "isBrandActive",
            "PRICE RANGE": "isPriceRangeActive",
            "ON SALE": "isPriceRangeActive",
            "NEW ARRIVALS": "isNewArrivalsActive",
            "RETAILER": "isRetailerActive",
            "TAG": "isTagActive",
        };

        return (
            <div className="filter-container">
                <div className="filter-anchor">
                    <Anchor
                        variant={AnchorVariant.SECONDARY}
                        onClick={() => this._toggleFilter("active")}>Filter <Icon></Icon></Anchor>
                </div>
                <div className={`filter-list ${this.state.active ? "" : "hidden"}`} >
                    {Object.keys(filterMap)
                    .map(filter => (
                        <Anchor
                            variant={AnchorVariant.SECONDARY}
                            onClick={() => this._toggleFilter(filterMap[filter])}>{filter}</Anchor>
                    ))}
                </div>
            </div>
        );
    }

    @autobind
    private _toggleFilter(stateField) {
        let newState = this.state;
        newState[stateField] = !newState[stateField];
        this.setState(newState);
    }
}
