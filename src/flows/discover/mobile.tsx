
import autobind from "autobind-decorator";
import * as React from "react";

import Card, { CardContainer } from "../../components/card";
import Carousel from "../../components/carousel";
import MobileCarouselItem from "../../components/carousel/mobileCarouselItem";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { PostCard } from "../flowComponents/cardView";
import ContentToolbar from "../flowComponents/contentToolbar";
import Featured from "../flowComponents/featured";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import ViewMore from "../flowComponents/viewMore";
import { ContentType, Filters, PostParam } from "../model";

import "./style.scss";
import { DiscoverProps, DiscoverState } from "./types";

interface MobileDiscoverState extends DiscoverState {
    gridSize: number;
}

export default class MobileDiscover extends React.Component<DiscoverProps, MobileDiscoverState> {
    state: MobileDiscoverState = {
        posts: [],
        nextToken: null,
        trendingPosts: [],
        featuredTrendnines: [],
        recommendedTrendnines: [],
        postParam: null,
        isLoading: true,
        loadingNext: false,
        gridSize: 1,
    };

    componentWillMount() {
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(nextProps: DiscoverProps) {
        if (!this.state.isLoading && nextProps.location !== this.props.location) {
            this.setState({ isLoading: true });
            this.refreshContent(nextProps);
        }
    }

    async refreshContent(props: DiscoverProps) {
        const params = new URLSearchParams(location.search);
        const postParam = new PostParam(params);
        let queryString = location.search;
        queryString += "&page_size=15";
        this.setState({ loadingNext: true });

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
            nextToken: posts.nextToken,
            trendingPosts: trendingPosts,
            featuredTrendnines: featuredTrendnines,
            recommendedTrendnines: recommendedTrendnines,
            postParam: postParam,
            isLoading: false,
            loadingNext: false,
        });
    }

    render() {
        if (this.state.isLoading) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        const carouselAttributes = {
            infinite: false,
            arrows: false,
            slidesToShow: 1,
            variableWidth: false,
            centerMode: true,
        };

        return (
            <div className="mobile-discover" id="mobile-discover">
                <Carousel attributes={carouselAttributes}>
                    <div>
                        <MobileCarouselItem>
                            {this.state.featuredTrendnines && this.state.featuredTrendnines.length > 0 &&
                                <Featured featuredTrendnines={this.state.featuredTrendnines} />
                            }
                        </MobileCarouselItem>
                    </div>
                    <div>
                        <MobileCarouselItem>
                            <SidebarSection title="Trending Now">
                                <PostRank posts={this.state.trendingPosts} />
                            </SidebarSection>
                        </MobileCarouselItem>
                    </div>
                </Carousel>
                {this.state.postParam.keyword !== "" && this.state.posts.length < 1 && (
                    <div className="no-search-result-text">
                        No results for "{ this.state.postParam.keyword }"
                    </div>
                )}
                <ContentToolbar
                    location={this.props.location}
                    history={this.props.history}
                    match={this.props.match}
                    contentType={ContentType.POST}
                    setGridSize={this._setGridSize}
                />
                <CardContainer gridSize={this.state.gridSize}>
                    {this._renderPosts()}
                </CardContainer>
                {this.state.nextToken && <ViewMore isLoading={this.state.loadingNext} onClick={this._paginateNextPosts} />}
            </div>
        );
    }

    @autobind
    private _renderPosts() {
        const posts = this.state.posts;
        const postCards = posts.map(post => (
            <PostCard
                gridSize={this.state.gridSize}
                post={post}
            />));

        return postCards;
    }

    @autobind
    private async _paginateNextPosts() {
        if (this.state.nextToken == null) {
            return;
        }
        this.setState({ loadingNext: true });

        const queryString = this.state.postParam.convertUrlParamToQueryString();
        const newPosts = await Promise.resolve(
            location.pathname === "/feed" ?
                this.props.getFeedPosts(queryString, this.state.nextToken)
                : this.props.getLatestPosts(queryString, this.state.nextToken));
        this.setState({
            posts: this.state.posts.concat(newPosts.list).filter((post, index, arr) => {
                return arr.map(mapPost => mapPost["id"]).indexOf(post["id"]) === index;
            }),
            nextToken: newPosts.nextToken,
            loadingNext: false,
        });
    }

    @autobind
    private _setGridSize(gridSize: number) {
        this.setState({ gridSize });
    }
}
