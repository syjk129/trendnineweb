import * as React from "react";
import { match } from "react-router";
import { PropTypes } from "prop-types";
import autobind from "autobind-decorator";

import Card, { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import { AppContext } from "../../app";
import { Post } from "../../api/models";

import "./style.scss";

interface DiscoverProps {
    match: match<String>;
}

interface DiscoverState {
    posts: Array<Post>;
}

export default class Discover extends React.Component<DiscoverProps, DiscoverState> {
    static contextTypes: AppContext;

    state: DiscoverState = {
        posts: [],
    };

    async componentWillMount() {
        try {
            const posts = await this.context.api.getLatestPosts();
            this.setState({ posts: posts.result });
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
        return (
            <div className="discover">
                <Sidebar>
                    sidebar
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
