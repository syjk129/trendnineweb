import * as React from "react";
import autobind from "autobind-decorator";

import { Person } from "../../../api/models";
import Button, { ButtonVariant } from "../../../components/button";
import Anchor, { AnchorVariant } from "../../../components/anchor";
import Icon, { IconVariant } from "../../../components/icon";
import CategoryFilter from "./filterComponents/categoryFilter";
import PriceFilter from "./filterComponents/priceFilter";
import BrandFilter from "./filterComponents/brandFilter";
import NewArrivalsFilter from "./filterComponents/newArrivalsFilter";
import OnSaleFilter from "./filterComponents/onSaleFilter";
import RetailerFilter from "./filterComponents/retailerFilter";
import TagFilter from "./filterComponents/tagFilter";

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
            "ON SALE": "isOnSaleActive",
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
                <div className={`filter-content ${this.state.active ? "" : "hidden"}`}>
                    <ul className="filter-list" >
                        {Object.keys(filterMap)
                        .map(filter => (
                            <li>
                                <Anchor
                                    className={this.state[filterMap[filter]] ? "selected" : ""}
                                    variant={AnchorVariant.SECONDARY}
                                    onClick={() => this._toggleFilter(filterMap[filter])}>{filter}</Anchor>
                            </li>
                        ))}
                    </ul>
                    <CategoryFilter active={this.state.isCategoryActive}></CategoryFilter>
                    <BrandFilter active={this.state.isBrandActive}></BrandFilter>
                    <PriceFilter active={this.state.isPriceRangeActive}></PriceFilter>
                    <OnSaleFilter active={this.state.isOnSaleActive}></OnSaleFilter>
                    <NewArrivalsFilter active={this.state.isNewArrivalsActive}></NewArrivalsFilter>
                    <RetailerFilter active={this.state.isRetailerActive}></RetailerFilter>
                    <TagFilter active={this.state.isTagActive}></TagFilter>
                </div>
            </div>
        );
    }

    @autobind
    private _toggleFilter(stateField) {
        let newState = this.state;
        newState[stateField] = !newState[stateField];

        if (stateField !== "active" && newState[stateField]) {
            for (let key of Object.keys(newState)) {
                if (key !== "active" && key !== stateField) {
                    newState[key] = false;
                }
            }
        }
        this.setState(newState);
    }
}
