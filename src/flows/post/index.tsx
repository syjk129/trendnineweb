import * as React from "react";
import { match } from "react-router";
import { PropTypes } from "prop-types";
import autobind from "autobind-decorator";

import Content from "../../components/content";
import Featured from "../../components/featured";
import Sidebar from "../../components/sidebar";
import Trending from "../../components/trending";
import { AppContext } from "../../app";
import { Person, Post } from "../../api/models";

import "./style.scss";

interface PostProps {
    match: match<any>;
}

interface PostState {
    currentPost: Post;
    posts: Array<Post>;
    featuredTrendnines: Array<Person>;
}

export default class PostView extends React.Component<PostProps, PostState> {
    static contextTypes: AppContext;

    state: PostState = {
        currentPost: null,
        posts: [],
        featuredTrendnines: [],
    };

    async componentWillMount() {
        try {
            const currentPost = await this.context.api.getPost(this.props.match.params.postId);
            const posts = await this.context.api.getLatestPosts();
            const featuredTrendnines = await this.context.api.getFeaturedTrendnines();

            this.setState({
                currentPost: currentPost.result,
                posts: posts.result,
                featuredTrendnines: featuredTrendnines.result,
            });
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
        return (
            <div className="post">
                <Sidebar>
                    <Featured featuredTrendnines={this.state.featuredTrendnines} />
                    {/* TODO: Get real trending items */}
                    <Trending trendingPosts={this.state.posts} />
                </Sidebar>
                <Content>
                    {this.state.currentPost && (
                        <div>
                            <p>{this.state.currentPost.title}</p>
                            <p>{this.state.currentPost.content}</p>
                        </div>
                    )}
                </Content>
            </div>
        );
    }
}

PostView.contextTypes = {
    api: PropTypes.any,
};
