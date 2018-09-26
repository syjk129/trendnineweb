import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { PostPreview, PostTag, PostTagType } from "../../api/models";
import { AppContext } from "../../app";
import { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Spinner from "../../components/spinner";
import Tab from "../../components/tab";
import LookCard from "../flowComponents/cardView/lookCard";
import { TagCarousel } from "../flowComponents/carousel";
import ContentToolbar from "../flowComponents/contentToolbar";
import Refine from "../flowComponents/refine";
import { ContentType, PostParam } from "../model";
import RouteProps from "../routeProps";
import { LookType } from "./types";

import "./style.scss";

type Props = RouteProps;

enum LookTab {
    LATEST = "latest",
    POPULAR = "popularity",
}

interface LooksState {
    looks: Array<PostPreview>;
    nextToken: string | null;
    loadingContent: boolean;
    loadingNext: boolean;
    selectedTab: LookTab;
    tags: Array<PostTag>;
    gridSize: number;
}

export default class Looks extends React.Component<Props, LooksState> {
    static contextTypes: AppContext;

    state: LooksState = {
        looks: [],
        nextToken: null,
        loadingContent: false,
        loadingNext: false,
        selectedTab: LookTab.LATEST,
        tags: [],
        gridSize: 2,
    };

    async componentWillMount() {
        this._pageRef = React.createRef();

        document.addEventListener("scroll", this._populateNext);
        document.addEventListener("touchmove", this._populateNext);

        this._lookType = this.props.match.params.lookType;
        this._lookSelection = this.props.match.params.lookSelection;

        this.setState({ loadingContent: true });
        const [
            looks,
            styles,
            occasions,
        ] = await Promise.all([
            this._fetchContent(this.props),
            this.context.api.getPostTags(PostTagType.STYLE),
            this.context.api.getPostTags(PostTagType.OCCASION),
        ]);

        this.setState({
            looks: looks.list,
            nextToken: looks.nextToken,
            loadingContent: false,
            tags: styles.concat(occasions),
        });
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this._populateNext);
        document.removeEventListener("touchmove", this._populateNext);
    }

    async componentWillReceiveProps(nextProps: Props) {
        this._lookType = nextProps.match.params.lookType;
        this._lookSelection = nextProps.match.params.lookSelection;

        if (nextProps.location.state && nextProps.location.state.refresh) {
            this.setState({ loadingContent: true });
            const looks = await this._fetchContent(nextProps);
            this.setState({ looks: looks.list, nextToken: looks.nextToken, loadingContent: false });
        }
    }

    render() {
        let ContentEl = isMobile ? "div" : Content;
        const user = JSON.parse(localStorage.getItem("user"));

        return (
            <>
                {!this.state.loadingContent && (
                    <TagCarousel
                        className="looks-tag-carousel"
                        tags={this.state.tags}
                        selectedTag={this._getSelectedTag()}
                    />
                )}
                <div className={`looks${isMobile ? " mobile" : ""}`} ref={this._pageRef}>
                    {!isMobile && (
                        <Sidebar>
                            <Refine noTagFilter onRefine={this._onRefine}/>
                        </Sidebar>
                    )}
                    <ContentEl className="look-content">
                        {isMobile ? (
                            <ContentToolbar
                                location={this.props.location}
                                history={this.props.history}
                                match={this.props.match}
                                gridSize={this.state.gridSize}
                                loggedIn={!!user}
                                contentType={ContentType.POST}
                                setGridSize={this._setGridSize}
                            />
                        ) : (
                            <div className="look-tabs">
                                <Tab
                                    selected={this.state.selectedTab === LookTab.LATEST}
                                    label="Most Recent"
                                    onSelect={() => this._selectTab(LookTab.LATEST)}
                                />
                                <Tab
                                    selected={this.state.selectedTab === LookTab.POPULAR}
                                    label="Most Popular"
                                    onSelect={() => this._selectTab(LookTab.POPULAR)}
                                />
                            </div>
                        )}
                        {this.state.loadingContent ? (
                            <Spinner />
                        ) : (
                            <CardContainer gridSize={this.state.gridSize}>
                                {this.state.looks.map(look => (
                                    <LookCard onload={onload} look={look} />
                                ))}
                            </CardContainer>
                        )}
                    </ContentEl>
                </div>
            </>
        );
    }

    private _pageRef: React.RefObject<HTMLDivElement>;
    private _pageSize = 12;
    private _lookType: LookType;
    private _lookSelection: string;

    private _setGridSize = (gridSize: number) => {
        this.setState({ gridSize });
    }

    private _getSelectedTag = () => {
        const params = new URLSearchParams(this.props.location.search);
        const postParam = new PostParam(params);
        return postParam.filters.tagIds.values().next().value;
    }

    private _selectTab = async (tabType: LookTab) => {
        this.setState({ selectedTab: tabType });
        const params = new URLSearchParams(this.props.location.search);
        const postParam = new PostParam(params);
        postParam.sort = tabType;
        this.props.history.push({
            pathname: this.props.location.pathname,
            search: postParam.convertToUrlParamString(),
            state: { refresh: true },
        });
    }

    private _fetchContent = async (props: Props, nextToken?: string) => {
        const params = new URLSearchParams(props.location.search);
        const postParam = new PostParam(params);
        let queryString = postParam.convertUrlParamToQueryString();
        queryString += `&page_size=${this._pageSize}`;

        return await this.context.api.getLatestPosts(queryString, nextToken);
    }

    private _populateNext = async () => {
        const page = this._pageRef.current;
        if (!page || page.getBoundingClientRect().bottom > window.innerHeight + 100 || this.state.loadingNext || !this.state.nextToken) {
            return;
        }

        this.setState({ loadingNext: true });

        const looks = await this._fetchContent(this.props, this.state.nextToken);
        this.setState({
            looks: this.state.looks.concat(looks.list),
            nextToken: looks.nextToken,
            loadingNext: false,
        });
    }

    private _onRefine = async (filterParam: PostParam) => {
        this.props.history.push(`/looks?${filterParam.convertToUrlParamString()}`);
        this.setState({ loadingContent: true });

        let queryString = `page_size=${this._pageSize}`;
        queryString += `&${filterParam.convertUrlParamToQueryString()}`;
        const looks = await this.context.api.getLatestPosts(queryString);
        this.setState({
            looks: looks.list,
            nextToken: looks.nextToken,
            loadingContent: false,
        });
    }
}

Looks.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
