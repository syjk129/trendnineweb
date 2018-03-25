import * as React from "react";
import { match, withRouter } from "react-router";
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
    match: match<String>;
}

interface DiscoverState {
    posts: Array<PostPreview>;
    featuredTrendnines: Array<Person>;
}

export default class Discover extends React.Component<DiscoverProps, DiscoverState> {
    static contextTypes: AppContext;

    state: DiscoverState = {
        posts: [],
        featuredTrendnines: [],
    };

    async componentWillMount() {
        try {
            const posts = await this.context.api.getLatestPosts();
            const featuredTrendnines = await this.context.api.getFeaturedTrendnines();

            this.setState({ posts, featuredTrendnines });
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
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
                    />
                    <CardContainer>
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
        const posts = await this.context.api.getLatestPosts(queryString);
        this.setState({posts: posts});
    }
}

Discover.contextTypes = {
    api: PropTypes.any,
};
