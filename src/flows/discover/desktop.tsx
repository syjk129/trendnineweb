
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { Person, PostPreview } from "../../api/models";
import { LinkButton } from "../../components/button";
import Card, { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Sticky from "../../components/sticky";
import { PostCard } from "../flowComponents/cardView";
import Featured from "../flowComponents/featured";
import Filter, { FilterTarget } from "../flowComponents/filter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Sort from "../flowComponents/sort";
import { Filters, PostParam } from "../model";

import "./style.scss";
import { DiscoverProps, DiscoverState } from "./types";

interface DesktopDiscoverState extends DiscoverState {
    numCardsPerRow: number;
}

export default class DesktopDiscover extends React.Component<DiscoverProps, DesktopDiscoverState> {
    state: DesktopDiscoverState = {
        posts: [],
        postsNextToken: "",
        trendingPosts: [],
        featuredTrendnines: [],
        recommendedTrendnines: [],
        postParam: null,
        isLoading: false,
        numCardsPerRow: 2,
    };

    componentWillMount() {
        this.setState({ isLoading: true });
        this.refreshContent(this.props);
        this.updateWindowWidth();
    }

    componentWillReceiveProps(props: DiscoverProps) {
        this.setState({ isLoading: true });
        this.refreshContent(props);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
        window.addEventListener("resize", this.updateWindowWidth);
    }

    componentDidUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
        window.removeEventListener("resize", this.updateWindowWidth);
    }

    async refreshContent(props: DiscoverProps) {
        const params = new URLSearchParams(location.search);
        const postParam = new PostParam(params);
        const queryString = postParam.convertUrlParamToQueryString();

        const [
            trendingPosts,
            featuredTrendnines,
            recommendedTrendnines,
            posts,
        ] = await Promise.all([
            this.props.getTrendingPosts(),
            this.props.getTodaysTrendnines(),
            this.props.getFeaturedTrendnines(),
            location.pathname === "/feed" ? this.props.getFeedPosts(queryString) : this.props.getLatestPosts(queryString),
        ]);

        this.setState({
            posts: posts.list,
            postsNextToken: posts.nextToken,
            trendingPosts: trendingPosts,
            featuredTrendnines: featuredTrendnines,
            recommendedTrendnines: recommendedTrendnines,
            postParam: postParam,
            isLoading: false,
        });
    }

    onScroll = () => {
        let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        let clientHeight = document.documentElement.clientHeight || window.innerHeight;
        let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
        if (scrolledToBottom) {
            this._paginateNextPosts();
        }
    }

    updateWindowWidth = () => {
        const GRID_GAP = 20;
        const CONTENT_MARGIN = 40;
        const CARD_WIDTH = 200;
        const SIDE_BAR_WIDTH = 280;
        const numCardsPerRow = Math.max((window.innerWidth + GRID_GAP - 2 * CONTENT_MARGIN - SIDE_BAR_WIDTH) / (CARD_WIDTH + GRID_GAP) | 3, 3);
        this.setState({numCardsPerRow: Math.max(numCardsPerRow, 2)});
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="discover">
                    <Content>
                        <br /><br /><br />Loading...
                    </Content>
                </div>
            );
        }
        return (
            <div className="discover">
                <Sidebar>
                    {this.state.featuredTrendnines && this.state.featuredTrendnines.length > 0 &&
                        <Featured featuredTrendnines={this.state.featuredTrendnines} />
                    }
                    <SidebarSection title="Trending Posts">
                        <PostRank posts={this.state.trendingPosts} />
                    </SidebarSection>
                </Sidebar>
                <Content>
                    {this.state.postParam.keyword !== "" && (
                        <div className="search-text-container">
                            <div className="search-help">You searched for</div>
                            <div className="search-text">{this.state.postParam.keyword}</div>
                        </div>
                    )}
                    <Sticky id="filter-container" stickyClassName="sticky-filter-container">
                        <div className="filter-container">
                            <Filter
                                onApply={this._filterPosts}
                                filterTarget={FilterTarget.POST}
                                default={this.state.postParam.filters}
                                className={this.state.postParam.keyword !== "" && this.state.posts.length < 1  ? "hide" : ""} />

                            <Sort
                                name="Sort by"
                                default={this.state.postParam.sort}
                                onSelect={this._sortPosts}
                            />

                        </div>
                    </Sticky>
                    {this.state.postParam.keyword !== "" && this.state.posts.length < 1 && (
                        <div className="no-search-result-text">
                            No results for "{ this.state.postParam.keyword }"
                        </div>
                    )}
                    <CardContainer>
                        {this._renderPosts()}
                    </CardContainer>
                </Content>
            </div>
        );
    }

    private _renderPosts() {
        const posts = this.state.posts;
        const postCards = posts.map(post => (
            <PostCard
                post={post}
            />));

        // update the logic to add recommended trendsetters whenever
        postCards.splice(this.state.numCardsPerRow * 4, 0, this._renderRecommendedtrendsetters());
        return postCards;
    }

    @autobind
    private async _paginateNextPosts() {
        if (this.state.postsNextToken == null) {
            return;
        }

        const queryString = this.state.postParam.convertUrlParamToQueryString();
        const newPosts = await Promise.resolve(
            location.pathname === "/feed" ?
                this.props.getFeedPosts(queryString, this.state.postsNextToken)
                : this.props.getLatestPosts(queryString, this.state.postsNextToken));
        this.setState({
            posts: this.state.posts.concat(newPosts.list).filter((post, index, arr) => {
                return arr.map(mapPost => mapPost["id"]).indexOf(post["id"]) === index;
            }),
            postsNextToken: newPosts.nextToken,
        });
    }

    @autobind
    private async _filterPosts(filters: Filters) {
        this.state.postParam.filters = filters;
        this._push(this.state.postParam);
    }

    @autobind
    private async _sortPosts(sortString: string) {
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

    private _renderRecommendedtrendsetters() {
        return (
            <div className="recommended-trendsetters-container">
                <p className="title">Trendsetters you might like</p>

                <div className="recommended-trendsetters">
                    {this.state.recommendedTrendnines.slice(0, 6).map(trendsetter => (
                        <LinkButton className="trendsetter" url={`/user/${trendsetter.id}`}>
                            <img src={trendsetter.profile_image_url} />
                            <div>{trendsetter.first_name} {trendsetter.last_name}</div>
                        </LinkButton>
                    ))}
                </div>
            </div>
        );
    }
}
