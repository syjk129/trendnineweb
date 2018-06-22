import autobind from "autobind-decorator";
import * as H from "history";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { match } from "react-router";

import { Person } from "../../api/models";
import { AppContext } from "../../app";
import { Filters, PostParam } from "../model";
import RouteProps from "../routeProps";
import DesktopUser from "./desktop";
import FollowButton from "./followButton";
import MobileUser from "./mobile";
import { UserContentType } from "./types";

import "./style.scss";

interface UserState {
    profile: any;
    content: Array<any>;
    contentType: UserContentType;
    nextToken: string | null;
    postParam: PostParam;
    loadingNext: boolean;
}

type Props = RouteProps;

export default class User extends React.Component<Props, UserState> {
    static contextTypes: AppContext;

    state: UserState = {
        profile: null,
        content: [],
        contentType: UserContentType.POST,
        nextToken: null,
        postParam: null,
        loadingNext: false,
    };

    componentWillMount() {
        this._user = JSON.parse(localStorage.getItem("user")) || {};
        let contentType = this.props.match.params.pageName ? this.props.match.params.pageName : UserContentType.POST;
        this._updateContent(this.props, contentType);
    }

    componentDidMount() {
        window.addEventListener("scroll", this._onScroll, false);
    }

    componentDidUnmount() {
        window.removeEventListener("scroll", this._onScroll, false);
    }

    async getDerivedStateFromProps() {
        this._user = JSON.parse(localStorage.getItem("user")) || {};
        let contentType = this.props.match.params.pageName ? this.props.match.params.pageName : UserContentType.POST;
        this._updateContent(this.props, contentType);
    }

    render() {
        return (
            <div>
                <BrowserView device={isBrowser}>
                    <DesktopUser
                        {...this.state}
                        user={this._user}
                        userId={this._userId}
                        pathname={location.pathname}
                        filterContent={this._filterContent}
                        sortContent={this._sortContent}
                        setContentType={this._setContentType}
                        fetchNextContent={this._fetchNextContent}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileUser
                        {...this.state}
                        user={this._user}
                        userId={this._userId}
                        pathname={location.pathname}
                        filterContent={this._filterContent}
                        sortContent={this._sortContent}
                        setContentType={this._setContentType}
                        fetchNextContent={this._fetchNextContent}
                    />
                </MobileView>
            </div>
        );
    }

    private _userId: string;

    private _user: Person;

    @autobind
    private async _setContentType(contentType?: UserContentType) {
        this._updateContent(this.props, contentType);
    }

    @autobind
    private async _filterContent(filters: Filters) {
        this.state.postParam.filters = filters;
        this._push(this.state.postParam);
    }

    @autobind
    private async _sortContent(sortString: string) {
        this.state.postParam.sort = sortString;
        this._push(this.state.postParam);
    }

    @autobind
    private async _push(postParams: PostParam) {
        this.props.history.push({
            pathname: location.pathname,
            search: `?${postParams.convertToUrlParamString()}`,
        });
    }

    @autobind
    private async _updateContent(props: Props, contentType?: UserContentType) {
        this.setState({
            profile: null,
            content: [],
            contentType: UserContentType.POST,
            nextToken: "",
            postParam: null,
        });

        const params = new URLSearchParams(location.search);
        const postParam = new PostParam(params);
        const queryString = postParam.convertUrlParamToQueryString();
        this._userId = props.match.params.userId;

        const [ profile, content ] = await Promise.all([
            this.context.api.getInfluencer(this._userId),
            this._fetchContent(contentType || this.state.contentType),
        ]);

        this.setState({ profile, content, contentType: contentType || this.state.contentType, postParam });
    }

    @autobind
    private async _fetchContent(contentType: UserContentType, queryString?: string, nextToken?: string) {
        switch (contentType) {
        case UserContentType.POST:
            return this.context.api.getPostsForUser(this._userId, queryString, nextToken);
        case UserContentType.PRODUCT:
            return this.context.api.getProductsForUser(this._userId, queryString, nextToken);
        case UserContentType.FOLLOWER:
            return this.context.api.getUserFollowers(this._userId, queryString, nextToken);
        case UserContentType.FOLLOWING:
            return this._user.username === this._userId ? this.context.api.getUserFollowing(this._userId, queryString, nextToken) : null;
        case UserContentType.POST_WISHLIST:
        case UserContentType.PRODUCT_WISHLIST:
            if (this._user.username !== this._userId) return null;
            const wishlistItems = await this.context.api.getWishlist();
            if (contentType === UserContentType.POST_WISHLIST) {
                return wishlistItems.post_items;
            } else {
                return wishlistItems.product_items;
            }
        }
    }

    @autobind
    private async _fetchNextContent() {
        if (this.state.nextToken == null) {
            return;
        }

        const queryString = this.state.postParam ? this.state.postParam.convertUrlParamToQueryString() : "";
        const newContent = await this._fetchContent(this.state.contentType, queryString, this.state.nextToken);
        this.setState({
            content: newContent,
            nextToken: newContent.nextToken,
        });
    }

    @autobind
    private _onScroll() {
        let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        let clientHeight = document.documentElement.clientHeight || window.innerHeight;
        let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

        if (scrolledToBottom) {
            this._fetchNextContent();
        }
    }
}

User.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};
