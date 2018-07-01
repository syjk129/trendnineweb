import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { AppContext } from "../../app";
import PageNavigation from "../flowComponents/pageNavigation";
import RouteProps from "../routeProps";
import DesktopShopDiscover from "./desktop";
import MobileShopDiscover from "./mobile";

type Props = RouteProps;

export default class ShopDiscover extends React.Component<Props> {
    static contextTypes: AppContext;

    render() {
        return (
            <div>
                <PageNavigation />
                <BrowserView device={isBrowser}>
                    <DesktopShopDiscover
                        {...this.props}
                        getLatestProducts={this._getLatestProducts}
                        getFeedProducts={this._getFeedProducts}
                        getCategories={this._getCategories}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileShopDiscover
                        {...this.props}
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
    openModal: PropTypes.func,
};
