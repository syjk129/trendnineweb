
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { Person, PostPreview } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import { LinkButton } from "../../components/button";
import Card, { CardContainer } from "../../components/card";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import { PostCard } from "../flowComponents/cardView";
import Featured from "../flowComponents/featured";
import Filter, { FilterTarget } from "../flowComponents/filter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Sort from "../flowComponents/sort";

import "./style.scss";
import { DiscoverProps, DiscoverState } from "./types";

export default class MobileDiscover extends React.Component<DiscoverProps, DiscoverState> {
    state: DiscoverState = {
        posts: [],
        postsNextToken: "",
        trendingPosts: [],
        featuredTrendnines: [],
        recommendedTrendnines: [],
        keyword: "",
        search: "",
        filter: "",
        sort: "",
        isLoading: false,
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

    async refreshContent(props: DiscoverProps) {
        const queryString = location.search;
        const keyword = new URLSearchParams(queryString).get("q") || "";
        const searchQuery = keyword ? `keyword=${keyword}` : "";

        const [
            trendingPosts,
            featuredTrendnines,
            recommendedTrendnines,
            posts,
        ] = await Promise.all([
            this.props.getTrendingPosts(),
            this.props.getTodaysTrendnines(),
            this.props.getFeaturedTrendnines(),
            location.pathname === "/feed" ? this.props.getFeedPosts() : this.props.getLatestPosts(searchQuery),
        ]);

        this.setState({
            posts: posts.list,
            postsNextToken: posts.nextToken,
            trendingPosts: trendingPosts,
            featuredTrendnines: featuredTrendnines,
            recommendedTrendnines: recommendedTrendnines,
            keyword: keyword,
            search: searchQuery,
            filter: "",
            sort: "",
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
        const GRID_GAP = 22;
        const CONTENT_MARGIN = 40;
        const CARD_WIDTH = 235;
        const numCardsPerRow = (window.innerWidth + GRID_GAP - 2 * CONTENT_MARGIN) / (CARD_WIDTH + GRID_GAP) - 1 | 0;
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
            <div className="mobile-discover">
                {this.state.featuredTrendnines && this.state.featuredTrendnines.length > 0 &&
                    <Featured featuredTrendnines={this.state.featuredTrendnines} />
                }
                <SidebarSection title="Trending Posts">
                    <PostRank posts={this.state.trendingPosts} />
                </SidebarSection>
                {this.state.keyword !== "" && this.state.posts.length < 1 && (
                    <div className="no-search-result-text">
                        No results for "{ this.state.keyword }"
                    </div>
                )}

                <CardContainer className={this.state.keyword === "" ? "" : "card-container-extra-space"}>
                    {this._renderPosts()}
                </CardContainer>
            </div>
        );
    }

    @autobind
    private async _filterPosts(filterString: string) {
        this.setState({
            filter: filterString,
            postsNextToken: "",
        }, this._updatePosts);
    }

    @autobind
    private async _sortPosts(sortString: string) {
        this.setState({
            sort: sortString,
            postsNextToken: "",
        }, this._updatePosts);
    }

    @autobind
    private async _getPosts() {
        let query = "";

        if (this.state.sort) {
            query = `${this.state.sort}`;
        }

        if (this.state.filter) {
            query += `&${this.state.filter}`;
        }

        if (this.state.keyword) {
            query += `&${this.state.search}`;
        }

        return location.pathname === "/feed" ? this.props.getFeedPosts() : this.props.getLatestPosts(query, this.state.postsNextToken);
    }

    @autobind
    private async _paginateNextPosts() {
        if (this.state.postsNextToken == null) {
            return;
        }

        const newPosts = await this._getPosts();
        this.setState({
            posts: this.state.posts.concat(newPosts.list).filter((post, index, arr) => {
                return arr.map(mapPost => mapPost["id"]).indexOf(post["id"]) === index;
            }),
            postsNextToken: newPosts.nextToken,
        });
    }

    @autobind
    private async _updatePosts() {
        const newPosts = await this._getPosts();
        this.setState({
            posts: newPosts.list,
            postsNextToken: newPosts.nextToken,
        });
    }

    @autobind
    private _renderPosts() {
        const posts = this.state.posts;
        const postCards = posts.map((post, index) => (
            <PostCard
                post={post}
            />));

        // update the logic to add recommended trendsetters whenever
        postCards.splice(this.state.numCardsPerRow * 4, 0, this._renderRecommendedtrendsetters());
        return postCards;
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
