
import autobind from "autobind-decorator";
import * as React from "react";

import { LinkButton } from "../../components/button";
import { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import Sticky from "../../components/sticky";
import { PostCard } from "../flowComponents/cardView";
import Featured from "../flowComponents/featured";
import Filter, { FilterTarget } from "../flowComponents/filter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarPostProductListSection, SidebarSection } from "../flowComponents/section";
import Sort from "../flowComponents/sort";
import { SortConstants } from "../flowComponents/sort/types";
import ViewMore from "../flowComponents/viewMore";
import { Filters, MenuCategoryQueryMap, PostParam } from "../model";
import Welcome from "./welcome";

import "./style.scss";
import { DiscoverProps, DiscoverState } from "./types";

interface DesktopDiscoverState extends DiscoverState {
    numCardsPerRow: number;
}

export default class DesktopDiscover extends React.Component<DiscoverProps, DesktopDiscoverState> {
    state: DesktopDiscoverState = {
        posts: [],
        nextToken: null,
        trendingPosts: null,
        featuredTrendnines: [],
        recommendedTrendnines: [],
        postParam: null,
        isLoading: true,
        loadingNext: false,
        numCardsPerRow: 2,
    };

    componentWillMount() {
        this.refreshContent(this.props);
        this.updateWindowWidth();
    }

    componentWillReceiveProps(nextProps: DiscoverProps) {
        if (nextProps.location !== this.props.location &&
            !nextProps.location.pathname.includes("share") && !nextProps.location.pathname.includes("login") && !nextProps.location.pathname.includes("onboarding")
        ) {
            this.refreshContent(nextProps);
        }
    }

    async refreshContent(props: DiscoverProps) {
        const params = new URLSearchParams(location.search);
        const postParam = new PostParam(params);
        const user = JSON.parse(localStorage.getItem("user"));
        this._categoryName = props.match.params.categoryName;
        if (!user && !postParam.sort) {
            postParam.sort = SortConstants.LATEST_ID;
        }
        if (this._categoryName) {
            postParam.filters.categoryIds.add(MenuCategoryQueryMap[this._categoryName]);
        }

        let queryString = postParam.convertUrlParamToQueryString();
        queryString += `&page_size=10`;
        this.setState({ isLoading: true });

        const [
            trendingPosts,
            featuredTrendnines,
            recommendedTrendnines,
            posts,
        ] = await Promise.all([
            this.props.getTrendingPosts(),
            this.props.getTodaysTrendnines(),
            this.props.getFeaturedTrendnines(),
            this.props.location.pathname === "/feed" ? this.props.getFeedPosts(queryString) : this.props.getLatestPosts(queryString),
        ]);

        this.setState({
            posts: posts.list,
            postParam,
            nextToken: posts.nextToken,
            trendingPosts: trendingPosts,
            featuredTrendnines: featuredTrendnines,
            recommendedTrendnines: recommendedTrendnines,
            isLoading: false,
        });

        this._staggerPopulatePosts(queryString, posts.nextToken, this.props.location.pathname === "/feed", 0);
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
        const user = JSON.parse(localStorage.getItem("user"));
        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed"));

        return (
            <>
                {this.props.location.search.indexOf("keyword") === -1 && this.props.location.pathname !== "/feed" && !this._categoryName && (
                    <Welcome loggedIn={!!user} location={this.props.location} history={this.props.history} match={this.props.match} />
                )}
                <div className="discover">
                    <Sidebar>
                        {this.state.featuredTrendnines && this.state.featuredTrendnines.length > 0 &&
                            <Featured featuredTrendnines={this.state.featuredTrendnines} />
                        }
                        {this.state.trendingPosts && (
                            <SidebarSection title="Trending Now">
                                <PostRank posts={this.state.trendingPosts} />
                            </SidebarSection>
                        )}
                        {recentlyViewed && !this.state.isLoading &&
                            <Sticky id="recently-viewed-section" stickyClassName="sticky-sidebar-recently-viewed">
                                <SidebarPostProductListSection title="Recently Viewed" items={recentlyViewed} />
                            </Sticky>
                        }
                    </Sidebar>
                    <Content>
                        {this.state.isLoading ? (
                            <SpinnerContainer>
                                <Spinner />
                            </SpinnerContainer>
                        ) : (
                            <>
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
                                            loggedIn={!!user}
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
                                {this.state.nextToken && <ViewMore isLoading={this.state.loadingNext} onClick={this._paginateNextPosts} />}
                            </>
                        )}
                    </Content>
                </div>
            </>
        );
    }

    private _categoryName: string | null;

    private _staggerPopulatePosts = async (queryString: string, nextToken: string | null, isFeed: boolean, index: number) => {
        if (index < 4 && nextToken) {
            const posts = isFeed ? await this.props.getFeedPosts(queryString, nextToken) : await this.props.getLatestPosts(queryString, nextToken);
            this.setState({
                posts: this.state.posts.concat(posts.list),
                nextToken: posts.nextToken,
            }, () => {
                this._staggerPopulatePosts(queryString, posts.nextToken, isFeed, ++index);
            });
        }
    }

    private _renderPosts() {
        const posts = this.state.posts;
        const postCards = posts && posts.map(post => (
            <PostCard post={post}/>
        ));

        // update the logic to add recommended trendsetters whenever
        postCards.splice(this.state.numCardsPerRow * 4, 0, this._renderRecommendedtrendsetters());
        return postCards;
    }

    @autobind
    private async _paginateNextPosts() {
        if (this.state.nextToken == null) {
            return;
        }
        this.setState({ loadingNext: true });

        let queryString = this.state.postParam.convertUrlParamToQueryString();

        this._categoryName = this.props.match.params.categoryName;
        if (this._categoryName) {
            queryString += `&categories=${MenuCategoryQueryMap[this._categoryName]}`;
        }
        queryString += "&page_size=10";

        const isFeed = this.props.location.pathname === "/feed";
        await this._staggerPopulatePosts(queryString, this.state.nextToken, isFeed, 0);
        this.setState({ loadingNext: false });
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
            pathname: this.props.location.pathname,
            search: `?${postParams.convertToUrlParamString()}`,
        });
    }

    private _renderRecommendedtrendsetters() {
        return (
            <span className="recommended-trendsetters-container">
                <p className="title">Influencers you might like</p>
                <div className="recommended-trendsetters">
                    {this.state.recommendedTrendnines.slice(0, 6).map(trendsetter => (
                        <LinkButton className="trendsetter" to={`/user/${trendsetter.id}`}>
                            <img src={trendsetter.profile_small_image_url} />
                            <div>{trendsetter.first_name} {trendsetter.last_name}</div>
                        </LinkButton>
                    ))}
                </div>
            </span>
        );
    }
}
