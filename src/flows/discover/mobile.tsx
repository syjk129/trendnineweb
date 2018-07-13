
import autobind from "autobind-decorator";
import * as React from "react";

import { CardContainer } from "../../components/card";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import { PostCard } from "../flowComponents/cardView";
import ContentToolbar from "../flowComponents/contentToolbar";
import { SortConstants } from "../flowComponents/sort/types";
import { ContentType, MenuCategoryQueryMap, PostParam } from "../model";
import FeaturedTrending from "./featuredTrending";
import Welcome from "./welcome";

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
        gridSize: 2,
    };

    componentWillMount() {
        this._pageRef = React.createRef();
        this.refreshContent(this.props);
    }

    componentDidMount() {
        document.addEventListener("scroll", this._paginateNextPosts);
        document.addEventListener("touchmove", this._paginateNextPosts);
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this._paginateNextPosts);
        document.removeEventListener("touchmove", this._paginateNextPosts);
    }

    componentWillReceiveProps(nextProps: DiscoverProps) {
        if (!this.state.isLoading && nextProps.location !== this.props.location &&
            !nextProps.location.pathname.includes("share") && !nextProps.location.pathname.includes("login") && !nextProps.location.pathname.includes("onboarding")
        ) {
            this.setState({ isLoading: true });
            this.refreshContent(nextProps);
        }
    }

    async refreshContent(props: DiscoverProps) {
        const params = new URLSearchParams(props.location.search);
        const postParam = new PostParam(params);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user && !postParam.sort) {
            postParam.sort = SortConstants.LATEST_ID;
        }
        let queryString = postParam.convertUrlParamToQueryString();
        this._categoryName = props.match.params.categoryName;
        if (this._categoryName) {
            queryString += `&categories=${MenuCategoryQueryMap[this._categoryName]}`;
        }
        queryString += "&page_size=18";
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

        const user = JSON.parse(localStorage.getItem("user"));

        return (
            <>
                <Welcome loggedIn={!!user} {...this.props} />
                <div className="mobile-discover" id="mobile-discover" ref={this._pageRef}>
                    <FeaturedTrending
                        {...this.props}
                        featuredTrendnines={this.state.featuredTrendnines}
                        trendingPosts={this.state.trendingPosts}
                    />
                    {this.state.postParam.keyword !== "" && this.state.posts.length < 1 && (
                        <div className="no-search-result-text">
                            No results for "{ this.state.postParam.keyword }"
                        </div>
                    )}
                    <ContentToolbar
                        location={this.props.location}
                        history={this.props.history}
                        match={this.props.match}
                        loggedIn={!!user}
                        contentType={ContentType.POST}
                        setGridSize={this._setGridSize}
                    />
                    <CardContainer gridSize={this.state.gridSize}>
                        {this._renderPosts()}
                    </CardContainer>
                    {this.state.loadingNext && <Spinner />}
                </div>
            </>
        );
    }

    private _pageRef: React.RefObject<HTMLDivElement>;
    private _categoryName: string | null;

    @autobind
    private _renderPosts() {
        const posts = this.state.posts;
        const postCards = posts.map(post => (
            <PostCard
                gridSize={this.state.gridSize}
                post={post}
                isMobile
            />));

        return postCards;
    }

    @autobind
    private async _paginateNextPosts() {
        if (this.state.nextToken == null) {
            return;
        }

        // Infinite Scroll
        const page = this._pageRef.current;
        if (!page || page.getBoundingClientRect().bottom > window.innerHeight + 110) {
            return;
        }

        this.setState({ loadingNext: true });
        let queryString = this.state.postParam.convertUrlParamToQueryString();
        queryString += "&page_size=18";
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
