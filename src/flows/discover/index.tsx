import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { Helmet } from "react-helmet";

import { AppContext } from "../../app";
import PageNavigation from "../flowComponents/pageNavigation";
import RouteProps from "../routeProps";
import DesktopDiscover from "./desktop";
import MobileDiscover from "./mobile";

type Props = RouteProps;

export default class Discover extends React.Component<Props> {
    static contextTypes: AppContext;

    render() {
        const { ...routeProps } = this.props;

        return (
            <>
                <Helmet defer={false}>
                    <meta name="description" content="Get inspired by style inspirations from fashion influencers" />
                </Helmet>
                <PageNavigation />
                <BrowserView device={isBrowser}>
                    <DesktopDiscover
                        {...routeProps}
                        getFeaturedTrendnines={this._getFeaturedTrendnines}
                        getLatestPosts={this._getLatestPosts}
                        getFeedPosts={this._getFeedPosts}
                        getTrendingPosts={this._getTrendingPosts}
                        getTodaysTrendnines={this._getTodaysTrendnines}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileDiscover
                        {...routeProps}
                        getFeaturedTrendnines={this._getFeaturedTrendnines}
                        getLatestPosts={this._getLatestPosts}
                        getFeedPosts={this._getFeedPosts}
                        getTrendingPosts={this._getTrendingPosts}
                        getTodaysTrendnines={this._getTodaysTrendnines}
                    />
                </MobileView>
            </>
        );
    }

    @autobind
    private _getLatestPosts(queryString?: string, nextToken?: string) {
        return this.context.api.getLatestPosts(queryString, nextToken);
    }

    @autobind
    private _getFeedPosts(queryString?: string, nextToken?: string) {
        return this.context.api.getFeedPosts(queryString, nextToken);
    }

    @autobind
    private _getTrendingPosts() {
        return this.context.api.getTrendingPosts();
    }

    @autobind
    private _getTodaysTrendnines() {
        return this.context.api.getTodaysTrendnines();
    }

    @autobind
    private _getFeaturedTrendnines() {
        return this.context.api.getFeaturedTrendnines();
    }
}

Discover.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
