import autobind from "autobind-decorator";
import * as H from "history";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { match, withRouter } from "react-router-dom";

import { AppContext } from "../../app";
import DesktopDiscover from "./desktop";
import MobileDiscover from "./mobile";

interface DiscoverProps {
    history: H.History;
    location: any;
    match: match<any>;
}

export default class Discover extends React.Component<DiscoverProps> {
    static contextTypes: AppContext;

    constructor(props: DiscoverProps) {
        super(props);
    }

    render() {
        const { ...routeProps } = this.props;

        return (
            <div>
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
            </div>
        );
    }

    @autobind
    private _getLatestPosts(queryString?: string, nextToken?: string) {
        return this.context.api.getLatestPosts(queryString, nextToken);
    }

    @autobind
    private _getFeedPosts(queryString?: string, nextToken?: string) {
        return this.context.api.getFeedPosts();
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
};
