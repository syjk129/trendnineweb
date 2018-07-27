
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { Helmet } from "react-helmet";

import { PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import RouteProps from "../routeProps";
import DesktopShopView from "./desktop";
import MobileShopView from "./mobile";

import "./style.scss";

type Props = RouteProps;

interface ShopState {
    popularPosts: Array<PostPreview>;
}

export default class Shop extends React.Component<Props, ShopState> {
    static contextTypes: AppContext;

    state: ShopState = {
        popularPosts: [],
    };

    async componentWillMount() {
        const popularPosts = await this.context.api.getLatestPosts("order_by=popularity&page_size=10");
        this.setState({ popularPosts: popularPosts.list });
    }

    render() {
        return (
            <>
                <Helmet defer={false}>
                    <title>Shop</title>
                    <meta name="description" content="Browse trendiest looks and outfits worn by fashion influencers" />
                </Helmet>
                <BrowserView device={isBrowser}>
                    <DesktopShopView popularPosts={this.state.popularPosts} />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileShopView popularPosts={this.state.popularPosts} />
                </MobileView>
            </>
        );
    }
}

Shop.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
