import autobind from "autobind-decorator";
import * as H from "history";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { match, withRouter } from "react-router-dom";

import { Category } from "../../api/models";
import { AppContext } from "../../app";
import PageNavigation from "../flowComponents/pageNavigation";
import RouteProps from "../routeProps";
import DesktopShopDiscover from "./desktop";
import MobileShopDiscover from "./mobile";

type Props = RouteProps;

interface ShopDiscoverState {
    selectedCategories: Array<string>;
}

export default class ShopDiscover extends React.Component<RouteProps, ShopDiscoverState> {
    static contextTypes: AppContext;

    state: ShopDiscoverState = {
        selectedCategories: [],
    };

    render() {
        return (
            <div>
                <PageNavigation />
                <BrowserView device={isBrowser}>
                    <DesktopShopDiscover
                        {...this.props}
                        {...this.state}
                        getLatestProducts={this._getLatestProducts}
                        getFeedProducts={this._getFeedProducts}
                        getCategories={this._getCategories}
                        toggleCategory={this._toggleCategory}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileShopDiscover
                        {...this.props}
                        {...this.state}
                        getLatestProducts={this._getLatestProducts}
                        getFeedProducts={this._getFeedProducts}
                        getCategories={this._getCategories}
                        toggleCategory={this._toggleCategory}
                    />
                </MobileView>
            </div>
        );
    }

    private _applyCategories = () => {
        const categoryQuery = this.state.selectedCategories.join(",");
        let pathname = this.props.location.pathname;
        if (categoryQuery.length > 0) {
            pathname += `?categories=${categoryQuery}`;
        }
        this.props.history.push(pathname);
    }

    private _toggleCategory = (category: Category) => {
        let selectedCategories = this.state.selectedCategories;
        const currentCategory = selectedCategories.find(selectedCategory => selectedCategory === category.full_name);
        if (currentCategory) {
            selectedCategories = this._removeCategory(category, selectedCategories);
        } else {
            selectedCategories = this._addCategory(category, selectedCategories);
        }
        this.setState({ selectedCategories }, this._applyCategories);
    }

    private _removeCategory = (category: Category, selectedCategories: Array<string>) => {
        let newTree = selectedCategories;
        newTree = newTree.filter(t => t !== category.full_name);
        return category.subcategories.reduce((tree: Array<string>, subcategory: Category) => {
            return this._removeCategory(subcategory, tree);
        }, newTree);
    }

    private _addCategory = (category: Category, selectedCategories: Array<string>) => {
        let newTree = selectedCategories;
        newTree.push(category.full_name);
        return category.subcategories.reduce((tree: Array<string>, subcategory: Category) => {
            return this._addCategory(subcategory, tree);
        }, newTree);
    }

    @autobind
    private _getLatestProducts(queryString?: string, nextToken?: string) {
        return this.context.api.getLatestProducts(queryString, nextToken);
    }

    @autobind
    private _getFeedProducts(queryString?: string, nextToken?: string) {
        return this.context.api.getFeedProducts(queryString, nextToken);
    }

    @autobind
    private _getCategories() {
        return this.context.api.getCategories();
    }
}

ShopDiscover.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
