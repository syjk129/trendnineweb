import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { match } from "react-router-dom";

import { Comment, Person, Post } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import Button, { ButtonVariant, LinkButton } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Icon, { IconSize, IconVariant} from "../../components/icon";
import Image, { ImageRatioVariant } from "../../components/image";
import Sidebar from "../../components/sidebar";
import ActionLinks, {ActionLinksVariant} from "../flowComponents/actions";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import { PostRank } from "../flowComponents/ranking";
import { ContentSection, SidebarSection } from "../flowComponents/section";
import SidebarGrid from "../flowComponents/sidebarGrid";
import Tag from "../flowComponents/tag";

import PostAuthorDetails from "./postAuthorDetails";
import ProductTag from "./productTag";

import "./style.scss";

interface PostProps {
    match: match<any>;
}

interface PostState {
    currentPost: Post;
    productTags: Array<any>;
    shouldUpdate: boolean;
    imageRef: any;
    comments: Array<Comment>;
    posts: Array<Post>;
    relatedProducts: Array<any>;
    relatedPosts: Array<Post>;
    featuredTrendnines: Array<Person>;
}

export default class PostView extends React.Component<PostProps, PostState> {
    static contextTypes: AppContext;

    state: PostState = {
        currentPost: null,
        productTags: [],
        shouldUpdate: true,
        imageRef: null,
        comments: [],
        posts: [],
        relatedProducts: [],
        relatedPosts: [],
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
                relatedPosts,
                featuredTrendnines,
            ] = await Promise.all([
                this.context.api.getPost(this._postId),
                this.context.api.getComments(this._postId),
                this.context.api.getLatestPosts(),
                this.context.api.getRelatedProducts(),
                this.context.api.getRelatedPosts(this._postId),
                this.context.api.getFeaturedTrendnines(),
            ]);

            this.setState({ currentPost, comments, posts, relatedProducts, relatedPosts, featuredTrendnines });
        } catch (err) {
            throw new Error(err);
        }
    }

    updateTags() {
        if (this.state.imageRef && this.state.shouldUpdate) {
            const rect = ReactDOM.findDOMNode(this.state.imageRef).getBoundingClientRect();

            const productTags = this.state.currentPost.product_tags.map(tag => ({
                product_id: tag.product_id,
                name: this.state.currentPost.products.find(product => product.id === tag.product_id).title,
                style: {
                    left: rect.left + rect.width * tag.x_axis,
                    top: rect.top + rect.height * tag.y_axis,
                },
            }));

            this.setState({ productTags, shouldUpdate: false });
        }
    }

    render() {
        const { currentPost, comments, relatedProducts, relatedPosts } = this.state;

        const commentsTitle = this.state.comments && this.state.comments.length > 0 ? (
            `Comments (${this.state.comments.length})`
        )  : "Comments";

        const productsInPost = currentPost && currentPost.products.length > 0 && this.state.currentPost.products;
        const tagsInPost = currentPost && currentPost.tags.length > 0 && currentPost.tags;
        const recommendedPosts = relatedPosts && relatedPosts.length > 0 && relatedPosts.slice(0, 4);

        if (currentPost) {
            this.updateTags();
        }

        return (
            <div className="post">
                <Sidebar>
                    {productsInPost && (
                        <SidebarSection title="Products in this post">
                            {productsInPost.map(product => (
                                <div className="post-card-hover-item">
                                    <LinkButton className="post-card-hover-btn" variant={ButtonVariant.SECONDARY}>
                                        <img className="post-card-hover-image" src={product.image.small_image_url} />
                                        <div className="post-card-hover-content">
                                            <p className="post-card-hover-name">
                                                {product.brand.name}
                                            </p>
                                            <p className="post-card-hover-title">
                                                {product.title}
                                            </p>
                                        </div>
                                    </LinkButton>
                                    { this._renderProductFooter(product) }
                                </div>
                            ))}
                        </SidebarSection>
                    )}
                    {tagsInPost && (
                        <SidebarSection title="Tags">
                            <div className="tag-container">
                                {tagsInPost.map(tag => (
                                    <Tag tag={tag} />
                                ))}
                            </div>
                        </SidebarSection>
                    )}
                    {recommendedPosts && (
                        <SidebarSection title="You may also like">
                            <PostRank posts={recommendedPosts} hideRanks />
                        </SidebarSection>
                    )}
                </Sidebar>
                <Content>
                    {currentPost && (
                        <div className="post-content" ref="cover">
                            <Image
                                className="post-cover"
                                src={this.state.currentPost.cover_image.original_image_url}
                                ratio={ImageRatioVariant.POST_COVER}
                                ref={this._setImageRef}
                            />
                            {this.state.productTags.map(tag => (
                                <ProductTag tag={tag} />
                            ))}
                            <p className="post-title">
                                {this.state.currentPost.title}
                            </p>
                            <div className="post-subtitle">
                                <PostAuthorDetails
                                    author={this.state.currentPost.author}
                                    postDate={new Date(this.state.currentPost.created)}
                                />
                                <ActionLinks
                                    variant={ActionLinksVariant.POST}
                                    id={this._postId}
                                    wishlisted={currentPost.wishlisted}
                                    likes={currentPost.likes}
                                    liked={currentPost.liked}
                                    iconSize={IconSize.LARGE}
                                />
                            </div>
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
                                            redirectUrl={`/product/${product.id}`}
                                            title={product.brand.name}
                                            detail={product.title}
                                            subdetail={ this._renderProductFooter(product) }
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
                    {relatedProducts && relatedProducts.length > 3 && (
                        <ContentSection title="You may also like">
                            <Carousel slidesToShow={relatedProducts.length >= 5 ? 5 : relatedProducts.length}>
                                {relatedProducts.map(product => (
                                    <div>
                                        <CarouselItem
                                            imageUrl={product.image.small_image_url}
                                            redirectUrl={`/product/${product.id}`}
                                            title={product.brand.name}
                                            detail={product.title}
                                            subdetail={ this._renderProductFooter(product) }
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
    private _imageRef: any;

    @autobind
    private _setImageRef(element: any) {
        this.setState({ imageRef: element });
    }

    @autobind
    private async _submitComment(comment: string, parentCommentId: string) {
        await this.context.api.submitComment(this._postId, comment, parentCommentId);
        const newComments = await this.context.api.getComments(this._postId);
        this.setState({ comments: newComments });
    }

    @autobind
    private _likeComment(commentId: string) {
        return this.context.api.likeComment(this._postId, commentId);
    }

    @autobind
    private _unlikeComment(commentId: string) {
        return this.context.api.unlikeComment(this._postId, commentId);
    }

    @autobind
    private _renderProductFooter(product) {
        return (
        <div className="post-card-hover-footer">
            <p className="post-card-hover-price">
                {`$${product.price}`}
            </p>
            <ActionLinks
                variant={ActionLinksVariant.PRODUCT}
                id={product.id}
                wishlisted={product.wishlisted}
            />
        </div>);
    }
}

PostView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};

