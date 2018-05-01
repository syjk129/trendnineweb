
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { FeaturedInfleuncer, Person, PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import Card, { CardContainer } from "../../components/card";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import { PostCard } from "../flowComponents/cardView";
import Featured from "../flowComponents/featured";
import Filter from "../flowComponents/filter";
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
    };

    componentWillMount() {
        this.setState({ isLoading: true });
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(props: DiscoverProps) {
        this.setState({ isLoading: true });
        this.refreshContent(props);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
    }

    componentDidUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
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

        const [
            newPosts,
        ] = await Promise.all([
            location.pathname === "/feed" ? this.context.api.getFeedPosts(this.state.postsNextToken)
                                            : this.context.api.getLatestPosts(queryString, this.state.postsNextToken),
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
                        className={this.state.keyword !== "" && this.state.posts.length < 1  ? "hide" : ""} />
                    </div>
                    <CardContainer className={this.state.keyword === "" ? "" : "card-container-extra-space"}>
                        {this._renderPosts(this.state.posts)}
                    </CardContainer>

                    {this.state.keyword !== "" && this.state.posts.length < 1 && (
                        <div className="no-search-result-text">
                            No results for "{ this.state.keyword }"
                        </div>
                    )}
                </Content>
            </div>
        );
    }

    @autobind
    private _renderPosts(posts: Array<PostPreview>) {
        const postCards =  posts.map((post, index) => (
            <PostCard
                post={post}
                likePost={this._likePost}
                unlikePost={this._unlikePost}
                toggleWishlist={this._toggleWishlist}
            />));

        postCards.splice(8, 0, this._renderRecommendedtrendsetters());
        return postCards;
    }

    private _renderRecommendedtrendsetters() {
        return (
            <div className="recommended-trendsetters">
                <p className="title">Trendesetters you might like</p>
                <Carousel slidesToShow={5}>
                    {this.state.recommendedTrendnines.map(trendsetter => (
                        <div>
                            <CarouselItem
                                imageUrl={trendsetter.profile_image_url}
                                redirectUrl={`/user/${trendsetter.id}`}
                                title={`${trendsetter.first_name} ${trendsetter.last_name}`}
                            />
                        </div>
                    ))}
                </Carousel>
            </div>
        );
    }

    @autobind
    private _toggleWishlist(postId: string, type: string) {
        this.context.setError(new Error("toggle"));
        return this.context.api.toggleWishlist(postId, type);
    }

    @autobind
    private _likePost(postId: string) {
        return this.context.api.likePost(postId);
    }

    @autobind
    private _unlikePost(postId: string) {
        return this.context.api.unlikePost(postId);
    }

    @autobind
    private async _filterPosts(queryString: string) {
        let query = queryString;

        if (this.state.keyword !== "") {
            query = `keyword=${this.state.keyword}&${query}`;
        }

        const newPosts = await this.context.api.getLatestPosts(query);
        this.setState({ posts: newPosts });
    }
}

Discover.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};
