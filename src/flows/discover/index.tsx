import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { AppContext, AppContextTypes } from "../../app";
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
            <div>
                <meta property="og:url" content="http://www.nytimes.com/2015/02/19/arts/international/when-great-minds-dont-think-alike.html" />
                <meta property="og:type" content="article" />
                <meta property="og:title" content="When Great Minds Don’t Think Alike" />
                <meta property="og:description" content="How much does culture influence creative thinking?" />
                <meta property="og:image" content="http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg" />
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
    openModal: PropTypes.func,
};
