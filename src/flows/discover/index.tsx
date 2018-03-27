import * as React from "react";
import { withRouter } from "react-router";
import { PropTypes } from "prop-types";
import autobind from "autobind-decorator";

import Card, { CardContainer } from "../../components/card";
import Filter from "../flowComponents/filter";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Featured from "../flowComponents/featured";
import { PostCard } from "../flowComponents/cardView";
import { PostRank } from "../flowComponents/ranking";
import { SidebarSection } from "../flowComponents/section";
import { AppContext } from "../../app";
import { Person, PostPreview } from "../../api/models";

import "./style.scss";

interface DiscoverProps {
    location: any;
}

interface DiscoverState {
    posts: Array<PostPreview>;
    keyword: string;
    featuredTrendnines: Array<Person>;
}

export default class Discover extends React.Component<DiscoverProps, DiscoverState> {
    static contextTypes: AppContext;

    state: DiscoverState = {
        posts: [],
        keyword: "",
        featuredTrendnines: [],
    };

    async componentWillMount() {
        const queryString = this.props.location.search;
        const params = new URLSearchParams(queryString);
        const keyword = params.get("q") || "";
        let posts = new Array();
        let featuredTrendnines = new Array();

        try {
            posts = keyword === "" ?
                await this.context.api.getLatestPosts() :
                await this.context.api.getLatestPosts("keyword=" + keyword);
        } catch (err) {
            console.warn(err);
        }

        try {
            featuredTrendnines = await this.context.api.getFeaturedTrendnines();
        } catch (err) {
            console.warn(err);
        }

        this.setState({ posts, keyword, featuredTrendnines });
    }

    render() {
        const keywordNode = this.state.keyword !== "" ? (
            <div className="search-text-container">
                <div className="search-help">You searched for</div>
                <div className="search-text">{this.state.keyword}</div>
            </div>
        ) : null;

        return (
            <div className="discover">
                <Sidebar>
                    <Featured featuredTrendnines={this.state.featuredTrendnines} />
                    {/* TODO: Get real trending items */}
                    <SidebarSection title="Trending Posts">
                        <PostRank posts={this.state.posts} />
                    </SidebarSection>
                </Sidebar>
                <Content>
                    <Filter onApply={this._filterPosts}>
                        {keywordNode}
                    </Filter>
                    <CardContainer className={this.state.keyword === "" ? "" : "card-container-extra-space"}>
                        {this.state.posts && this._renderPosts()}
                    </CardContainer>
                </Content>
            </div>
        );
    }

    @autobind
    private _renderPosts() {
        return this.state.posts.map(post => (
            <PostCard post={post} />
        ));
    }

    @autobind
    private async _filterPosts(queryString: string) {
        const posts = this.state.keyword === "" ?
            await this.context.api.getLatestPosts(queryString) :
            await this.context.api.getLatestPosts("keyword=" + this.state.keyword + "&" + queryString);
        this.setState({posts: posts});
    }
}

Discover.contextTypes = {
    api: PropTypes.any,
};
