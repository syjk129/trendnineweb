import * as React from "react";
import { match } from "react-router";
import { PropTypes } from "prop-types";

import Sidebar from "../components/sidebar";
import Content from "../components/content";
import { AppContext } from "../app";
import { Post } from "../api/models";

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
            console.log(posts);
            this.setState({ posts: posts.result });
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
        return (
            <div>
                <Sidebar>
                    sidebar
                </Sidebar>
                <Content>
                    {this.state.posts.map(post => {
                        return post.title;
                    })}
                </Content>
            </div>
        );
    }

    private _renderPosts() {
        return this.state.posts.map(post => {
            return post.title;
        });
    }
}

Discover.contextTypes = {
    api: PropTypes.any,
};
