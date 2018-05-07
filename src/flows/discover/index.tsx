
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { FeaturedInfleuncer, Person, PostPreview } from "../../api/models";
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

import "./style.scss";

interface DiscoverProps {
    location: any;
    match: match<any>;
}

interface DiscoverState {
    posts: Array<PostPreview>;
    postsNextToken: string;
    trendingPosts: Array<PostPreview>;
    featuredTrendnines: Array<FeaturedInfleuncer>;
    recommendedTrendnines: Array<Person>;
    keyword: string;
    isLoading: boolean;
    numCardsPerRow: number;
}

export default class Discover extends React.Component<DiscoverProps, DiscoverState> {
    static contextTypes: AppContext;

    state: DiscoverState = {
        posts: [],
        postsNextToken: "",
        trendingPosts: [],
        featuredTrendnines: [],
        recommendedTrendnines: [],
        keyword: "",
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
        const queryString = location.search;
        const keyword = new URLSearchParams(queryString);
        const query = keyword.get("q") ? `keyword=${keyword.get("q")}` : "";

        const [
            trendingPosts,
            featuredTrendnines,
            recommendedTrendnines,
            posts,
        ] = await Promise.all([
            this.context.api.getTrendingPosts(),
            this.context.api.getTodaysTrendnines(),
            this.context.api.getFeaturedTrendnines(),
            location.pathname === "/feed" ? this.context.api.getFeedPosts() : this.context.api.getLatestPosts(query),
        ]);

        this.setState({
            posts: posts.list,
            postsNextToken: posts.nextToken,
            trendingPosts: trendingPosts,
            featuredTrendnines: featuredTrendnines,
            recommendedTrendnines: recommendedTrendnines,
            keyword: keyword.get("q") || "",
            isLoading: false,
        });
    }

    async paginateNextPosts(props: DiscoverProps) {
        if (this.state.postsNextToken == null) {
            return;
        }

        const queryString = location.search;
        const keyword = new URLSearchParams(queryString);
        const query = keyword.get("q") ? `keyword=${keyword.get("q")}` : "";

        const [
            newPosts,
        ] = await Promise.all([
            location.pathname === "/feed" ? this.context.api.getFeedPosts(this.state.postsNextToken)
                                            : this.context.api.getLatestPosts(query, this.state.postsNextToken),
        ]);

        let posts = this.state.posts.concat(newPosts.list);
        posts = posts.filter((post, index, arr) => {
            return arr.map(mapPost => mapPost["id"]).indexOf(post["id"]) === index;
        });

        this.setState({
            posts: posts,
            postsNextToken: newPosts.nextToken,
        });
    }

    onScroll = () => {
        let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        let clientHeight = document.documentElement.clientHeight || window.innerHeight;
        let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
        if (scrolledToBottom) {
            this.paginateNextPosts(this.props);
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
            return "Loading...";
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
                    <div className="filter-container">
                        {this.state.keyword !== "" && (
                            <div className="search-text-container">
                                <div className="search-help">You searched for</div>
                                <div className="search-text">{this.state.keyword}</div>
                            </div>
                        )}
                        <Filter
                        onApply={this._filterPosts}
                        filterTarget={FilterTarget.POST}
                        className={this.state.keyword !== "" && this.state.posts.length < 1  ? "hide" : ""} />
                    </div>

                    {this.state.keyword !== "" && this.state.posts.length < 1 && (
                        <div className="no-search-result-text">
                            No results for "{ this.state.keyword }"
                        </div>
                    )}

                    <CardContainer className={this.state.keyword === "" ? "" : "card-container-extra-space"}>
                        {this._renderPosts()}
                    </CardContainer>
                </Content>
            </div>
        );
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

    @autobind
    private async _filterPosts(queryString: string) {
        let query = queryString;

        if (this.state.keyword !== "") {
            query = `keyword=${this.state.keyword}&${query}`;
        }

        const newPosts = await this.context.api.getLatestPosts(query);
        this.setState({ posts: newPosts.list });
    }
}

Discover.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};
