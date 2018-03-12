import autobind from "autobind-decorator";
import * as React from "react";
import { match } from "react-router";
import { PropTypes } from "prop-types";

import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import Tag from "../flowComponents/tag";
import { SectionHeader, SidebarHeader } from "../flowComponents/header";
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
    relatedProducts: Array<any>;
    featuredTrendnines: Array<Person>;
}

export default class PostView extends React.Component<PostProps, PostState> {
    static contextTypes: AppContext;

    state: PostState = {
        currentPost: null,
        comments: [],
        posts: [],
        relatedProducts: [],
        featuredTrendnines: [],
    };

    async componentWillMount() {
        this._postId = this.props.match.params.postId;

        try {
            const [
                currentPost,
                comments,
                posts,
                relatedProducts,
                featuredTrendnines,
            ] = await Promise.all([
                this.context.api.getPost(this._postId),
                this.context.api.getComments(this._postId),
                this.context.api.getLatestPosts(),
                this.context.api.getRelatedProducts(),
                this.context.api.getFeaturedTrendnines(),
            ]);

            this.setState({ currentPost, comments, posts, relatedProducts, featuredTrendnines });
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
                    <SidebarHeader title="Products in this post" />
                    {this.state.currentPost && this.state.currentPost.products.map(product => (
                        <CarouselItem
                            imageUrl={product.image.small_image_url}
                            title={product.brand}
                            detail={product.title}
                            subdetail={`$${product.price}`}
                        />
                    ))}
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
                    <SectionHeader title="Products in this post" />
                    <Carousel>
                        {this.state.currentPost && this.state.currentPost.products.map(product => (
                            <div>
                                <CarouselItem
                                    imageUrl={product.image.small_image_url}
                                    title={product.brand}
                                    detail={product.title}
                                    subdetail={`$${product.price}`}
                                />
                            </div>
                        ))}
                    </Carousel>
                    <SectionHeader title="Tags" />
                    <div className="tag-list">
                        {this.state.currentPost && this.state.currentPost.tags.map(tag => (
                            <Tag tag={tag} />
                        ))}
                    </div>
                    <SectionHeader title="You may also like" />
                    <Carousel>
                        {this.state.relatedProducts && this.state.relatedProducts.map(product => (
                            <div>
                                <CarouselItem
                                    imageUrl={product.image.small_image_url}
                                    title={product.brand}
                                    detail={product.title}
                                    subdetail={`$${product.price}`}
                                />
                            </div>
                        ))}
                    </Carousel>
                    <SectionHeader title={commentsTitle} />
                    <Comments
                        comments={this.state.comments}
                        likeComment={this._likeComment}
                        unlikeComment={this._unlikeComment}
                        submitComment={this._submitComment}
                    />
                </Content>
            </div>
        );
    }

    private _postId: string;

    @autobind
    private _submitComment(comment: string, parentCommentId: string) {
        return this.context.api.submitComment(this._postId, comment, parentCommentId);
    }

    @autobind
    private _likeComment(commentId: string) {
        return this.context.api.likeComment(this._postId, commentId);
    }

    @autobind
    private _unlikeComment(commentId: string) {
        return this.context.api.unlikeComment(this._postId, commentId);
    }
}

PostView.contextTypes = {
    api: PropTypes.any,
};
