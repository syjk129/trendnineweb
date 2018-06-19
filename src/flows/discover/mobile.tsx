
import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match, withRouter } from "react-router-dom";

import { Person, PostPreview } from "../../api/models";
import { LinkButton } from "../../components/button";
import Card, { CardContainer } from "../../components/card";
import Carousel from "../../components/carousel";
import MobileCarouselItem from "../../components/carousel/mobileCarouselItem";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import Sticky from "../../components/sticky";
import { PostCard } from "../flowComponents/cardView";
import ContentToolbar from "../flowComponents/contentToolbar";
import Featured from "../flowComponents/featured";
import Filter, { FilterTarget } from "../flowComponents/filter";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import Sort from "../flowComponents/sort";
import { ContentType, Filters, PostParam } from "../model";

import "./style.scss";
import { DiscoverProps, DiscoverState } from "./types";

interface MobileDiscoverState extends DiscoverState {
    gridSize: number;
}

export default class MobileDiscover extends React.Component<DiscoverProps, MobileDiscoverState> {
    state: MobileDiscoverState = {
        posts: [],
        postsNextToken: "",
        trendingPosts: [],
        featuredTrendnines: [],
        recommendedTrendnines: [],
        postParam: null,
        isLoading: false,
        gridSize: 1,
    };

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
    }

    componentDidUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(props: DiscoverProps) {
        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
            this.refreshContent(props);
        }
    }

    async refreshContent(props: DiscoverProps) {
        const params = new URLSearchParams(location.search);
        const postParam = new PostParam(params);
        const queryString = location.search;

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
                            <SidebarSection title="Trending Posts">
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
                <CardContainer gridSize={this.state.gridSize} className={this.state.postParam.keyword === "" ? "" : "card-container-extra-space"}>
                    {this._renderPosts()}
                </CardContainer>
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
    private _setGridSize(gridSize: number) {
        this.setState({ gridSize });
    }
}
