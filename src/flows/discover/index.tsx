import * as React from "react";
import { match, withRouter } from "react-router";
import { PropTypes } from "prop-types";
import autobind from "autobind-decorator";

import Card, { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Featured from "../flowComponents/featured";
import Trending from "../flowComponents/trending";
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
                    <Trending trendingPosts={this.state.posts} />
                </Sidebar>
                <Content>
                    <CardContainer>
                        {this._renderPosts()}
                    </CardContainer>
                </Content>
            </div>
        );
    }

    @autobind
    private _renderPosts() {
        return this.state.posts.map(post => (
            <Card post={post} />
        ));
    }
}

Discover.contextTypes = {
    api: PropTypes.any,
};
