import autobind from "autobind-decorator";
import * as React from "react";
import { match } from "react-router";
import { PropTypes } from "prop-types";

import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import SectionHeader from "../flowComponents/sectionHeader";
import Trending from "../flowComponents/trending";
import { AppContext } from "../../app";
import { Comment, Person, Post } from "../../api/models";

import PostAuthorDetails from "./postAuthorDetails";

import "./style.scss";

interface PostProps {
    match: match<any>;
}

interface PostState {
    currentPost: Post;
    comments: Array<Comment>;
    posts: Array<Post>;
    featuredTrendnines: Array<Person>;
}

export default class PostView extends React.Component<PostProps, PostState> {
    static contextTypes: AppContext;

    state: PostState = {
        currentPost: null,
        comments: [],
        posts: [],
        featuredTrendnines: [],
    };

    async componentWillMount() {
        this._postId = this.props.match.params.postId;

        try {
            const [
                currentPost,
                comments,
                posts,
                featuredTrendnines,
            ] = await Promise.all([
                this.context.api.getPost(this._postId),
                this.context.api.getComments(this._postId),
                this.context.api.getLatestPosts(),
                this.context.api.getFeaturedTrendnines(),
            ]);
            // const currentPost = await this.context.api.getPost(this.props.match.params.postId);
            // const posts = await this.context.api.getLatestPosts();
            // const featuredTrendnines = await this.context.api.getFeaturedTrendnines();

            this.setState({ currentPost, comments, posts, featuredTrendnines });
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
        const commentsTitle = this.state.comments && this.state.comments.length > 0 ? (
            `Comments (${this.state.comments.length})`
        )  : "Comments";

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
                    <SectionHeader title={commentsTitle} />
                    <Comments
                        comments={this.state.comments}
                        submitComment={this._submitComment}
                    />
                </Content>
            </div>
        );
    }

    private _postId: string;

    @autobind
    private _submitComment(comment: string) {
        this.context.api.submitComment(this._postId, comment);
    }
}

PostView.contextTypes = {
    api: PropTypes.any,
};
