import * as React from "react";
import { match, withRouter } from "react-router-dom";
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
    match: match<any>;
}

interface DiscoverState {
    posts: Array<PostPreview>;
    featuredTrendnines: Array<Person>;
    keyword: string;
    pageName: string;
    isLoading: boolean;
}

export default class Discover extends React.Component<DiscoverProps, DiscoverState> {
    static contextTypes: AppContext;

    state: DiscoverState = {
        posts: [],
        featuredTrendnines: [],
        keyword: "",
        pageName: "discover",
        isLoading: true,
    };

    async componentWillMount() {
        try {
            const queryString = this.props.location.search;
            const keyword = new URLSearchParams(queryString);
            const [
                posts,
                featuredTrendnines,
            ] = await Promise.all([
                this.context.api.getLatestPosts(queryString),
                this.context.api.getFeaturedTrendnines(),
            ]);

            this.setState({
                posts,
                featuredTrendnines,
                keyword: keyword.get("q") || "",
                pageName: this.props.match.params.pageName || "discover",
                isLoading: false,
            });
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
        if (this.state.isLoading) {
            return null;
        }

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
                        {this._renderPosts()}
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
    private _renderPosts() {
        return this.state.posts.map(post => (
            <PostCard post={post} />
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
