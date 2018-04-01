import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match } from "react-router-dom";

import { Comment, Person, Post } from "../../api/models";
import { AppContext } from "../../app";
import Button, { ButtonVariant } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import { ContentSection, SidebarSection } from "../flowComponents/section";
import SidebarGrid from "../flowComponents/sidebarGrid";
import Tag from "../flowComponents/tag";

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
        const { currentPost, comments, relatedProducts } = this.state;

        const commentsTitle = this.state.comments && this.state.comments.length > 0 ? (
            `Comments (${this.state.comments.length})`
        )  : "Comments";

        const productsInPost = currentPost && currentPost.products.length > 0 && this.state.currentPost.products.slice(0, 4);
        const tagsInPost = currentPost && currentPost.tags.length > 0 && currentPost.tags;
        const relatedInPost = relatedProducts && relatedProducts.length > 0 && relatedProducts.slice(0, 4);

        return (
            <div className="post">
                <Sidebar>
                    {productsInPost && (
                        <SidebarSection title="Products in this post">
                            {productsInPost.map(product => (
                                <SidebarGrid>
                                    <CarouselItem
                                        imageUrl={product.image.small_image_url}
                                        title={product.brand}
                                        detail={product.title}
                                        subdetail={`$${product.price}`}
                                    />
                                </SidebarGrid>
                            ))}
                            <Button variant={ButtonVariant.OUTLINE}>
                                View More
                            </Button>
                        </SidebarSection>
                    )}
                    {tagsInPost && (
                        <SidebarSection title="Tags">
                            {tagsInPost.map(tag => (
                                <Tag tag={tag} />
                            ))}
                        </SidebarSection>
                    )}
                    {relatedInPost && (
                        <SidebarSection title="You may also like">
                            {relatedProducts.map(product => (
                                <SidebarGrid>
                                    <CarouselItem
                                        imageUrl={product.image.small_image_url}
                                        title={product.brand}
                                        detail={product.title}
                                        subdetail={`$${product.price}`}
                                    />
                                </SidebarGrid>
                            ))}
                            <Button variant={ButtonVariant.OUTLINE}>
                                View More
                            </Button>
                        </SidebarSection>
                    )}
                </Sidebar>
                <Content>
                    {currentPost && (
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
                    {productsInPost && (
                        <ContentSection title="Products in this post">
                            <Carousel slidesToShow={5}>
                                {productsInPost.map(product => (
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
                        </ContentSection>
                    )}
                    {tagsInPost && (
                        <ContentSection title="Tags">
                            {tagsInPost.map(tag => (
                                <Tag tag={tag} inline />
                            ))}
                        </ContentSection>
                    )}
                    {relatedInPost && (
                        <ContentSection title="You may also like">
                            <Carousel slidesToShow={5}>
                                {relatedInPost.map(product => (
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
                        </ContentSection>
                    )}
                    <ContentSection title={commentsTitle}>
                        <Comments
                            comments={this.state.comments}
                            likeComment={this._likeComment}
                            unlikeComment={this._unlikeComment}
                            submitComment={this._submitComment}
                        />
                    </ContentSection>
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
