import autobind from "autobind-decorator";
import * as H from "history";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { match, withRouter } from "react-router-dom";

import { AppContext } from "../../app";
import PageNavigation from "../flowComponents/pageNavigation";
import DesktopShopDiscover from "./desktop";
import MobileShopDiscover from "./mobile";

interface ShopDiscoverProps {
    history: H.History;
    location: any;
    match: match<any>;
}

export default class ShopDiscover extends React.Component<ShopDiscoverProps> {
    static contextTypes: AppContext;

    constructor(props: ShopDiscoverProps) {
        super(props);
    }

    render() {
        const { ...routeProps } = this.props;

        return (
            <div>
                <PageNavigation />
                <BrowserView device={isBrowser}>
                    <DesktopShopDiscover
                        {...routeProps}
                        getLatestProducts={this._getLatestProducts}
                        getFeedProducts={this._getFeedProducts}
                        getCategories={this._getCategories}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileShopDiscover
                        {...routeProps}
                        getLatestProducts={this._getLatestProducts}
                        getFeedProducts={this._getFeedProducts}
                        getCategories={this._getCategories}
                    />
                </MobileView>
            </div>
        );
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
};
