import { PropTypes } from "prop-types";
import * as React from "react";
import FadeIn from "react-lazyload-fadein";

import { PostPreview, PostTag, PostTagType } from "../../api/models";
import { AppContext } from "../../app";
import { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Spinner from "../../components/spinner";
import Tab from "../../components/tab";
import LookCard from "../flowComponents/cardView/lookCard";
import { TagCarousel } from "../flowComponents/carousel";
import Refine from "../flowComponents/refine";
import { PostParam } from "../model";
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
        return (
            <>
                <TagCarousel className="looks-tag-carousel" tags={this.state.tags} />
                <div className="looks" ref={this._pageRef}>
                    <Sidebar>
                        <Refine onRefine={this._onRefine}/>
                    </Sidebar>
                    <Content>
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
                        {this.state.loadingContent ? (
                            <Spinner />
                        ) : (
                            <CardContainer>
                                {this.state.looks.map(look => (
                                    <FadeIn height={540} duration={150}>
                                        {onload => (
                                            <LookCard onload={onload} look={look} />
                                        )}
                                    </FadeIn>
                                ))}
                            </CardContainer>
                        )}
                    </Content>
                </div>
            </>
        );
    }

    private _pageRef: React.RefObject<HTMLDivElement>;
    private _pageSize = 12;
    private _lookType: LookType;
    private _lookSelection: string;

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
        if (!page || page.getBoundingClientRect().bottom > window.innerHeight || this.state.loadingNext || !this.state.nextToken) {
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
