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

import PostAuthorDetails from "./postAuthorDetails";

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
                    <Trending trendingPosts={this.state.posts} />
                </Sidebar>
                <Content>
                    {this.state.currentPost && (
                        <div className="post-content">
                            <img
                                className="post-cover"
                                src={this.state.currentPost.cover_image.original_image_url}
                            />
                            <p className="post-title">
                                {this.state.currentPost.title}
                            </p>
                            <PostAuthorDetails
                                author={this.state.currentPost.author}
                                postDate={new Date(this.state.currentPost.created)}
                            />
                            <div className="post-details">
                                {/* TODO: Don't use dangerouslySetInnerHTML. Make this safer */}
                                <div dangerouslySetInnerHTML={{ __html: this.state.currentPost.content }} />
                            </div>
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
