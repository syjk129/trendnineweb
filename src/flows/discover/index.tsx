
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { FeaturedInfleuncer, PostPreview } from "../../api/models";
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
    trendingPosts: Array<PostPreview>;
    featuredTrendnines: Array<FeaturedInfleuncer>;
    recommendedTrendnines: Array<FeaturedInfleuncer>;
    keyword: string;
    isLoading: boolean;
}

export default class Discover extends React.Component<DiscoverProps, DiscoverState> {
    static contextTypes: AppContext;

    state: DiscoverState = {
        posts: [],
        trendingPosts: [],
        featuredTrendnines: [],
        recommendedTrendnines: [],
        keyword: "",
        isLoading: true,
    };

    componentWillMount() {
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(props: DiscoverProps) {
        this.refreshContent(props);
    }

    async refreshContent(props: DiscoverProps) {
        const queryString = location.search;
        const keyword = new URLSearchParams(queryString);
        const [
            trendingPosts,
            featuredTrendnines,
            recommendedTrendnines,
            posts,
        ] = await Promise.all([
            this.context.api.getTrendingPosts(),
            this.context.api.getTodaysTrendnines(),
            this.context.api.getFeaturedTrendnines(),
            location.pathname === "/feed" ? this.context.api.getFeedPosts() : this.context.api.getLatestPosts(queryString),
        ]);

        this.setState({
            posts,
            trendingPosts,
            featuredTrendnines,
            recommendedTrendnines,
            keyword: keyword.get("q") || "",
            isLoading: false,
        });
    }

    render() {
        if (this.state.isLoading) {
            return null;
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
                    <Filter
                        onApply={this._filterPosts}
                        className={this.state.keyword !== "" && this.state.posts.length < 1  ? "hide" : ""}
                    >
                        {this.state.keyword !== "" && (
                            <div className="search-text-container">
                                <div className="search-help">You searched for</div>
                                <div className="search-text">{this.state.keyword}</div>
                            </div>
                        )}
                    </Filter>
                    <CardContainer className={this.state.keyword === "" ? "" : "card-container-extra-space"}>
                        {this._renderPosts(this.state.posts.slice(0, 8))}
                    </CardContainer>
                    <div className="recommended-trendsetters">
                        <p className="title">We recommend these trendesetters</p>
                        <Carousel slidesToShow={5}>
                            {this.state.trendingPosts.map(post => (
                                <div>
                                    <CarouselItem
                                        imageUrl={post.cover_image}
                                        redirectUrl={`/user/${post.id}`}
                                        title="Scarlett Johannson"
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                    <CardContainer className={this.state.keyword === "" ? "" : "card-container-extra-space"}>
                        {this._renderPosts(this.state.posts.slice(8))}
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
        return posts.map((post, index) => (
            <PostCard
                post={post}
                likePost={() => this.context.api.likePost(post.id)}
                unlikePost={() => this.context.api.unlikePost(post.id)}
                toggleWishlist={this.context.api.toggleWishlist}
            />
        ));
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
};
