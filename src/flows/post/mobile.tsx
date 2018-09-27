import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { Comment, Post, PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import Carousel, { CarouselItem } from "../../components/carousel";
import { IconSize } from "../../components/icon";
import Image, { ImageFitVariant } from "../../components/image";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import Comments from "../flowComponents/comments";
import { ContentSection, TabbedSection } from "../flowComponents/section";
import PostAuthorDetails from "./postAuthorDetails";
import { TabbedSectionTypes } from "./types";

export interface MobilePostProps {
    post: Post;
    scrollRef: React.RefObject<HTMLDivElement>;
    isModal: boolean;
}

export interface MobilePostState {
    section: TabbedSectionTypes;
    tabbedContent: Array<any>;
    comments: Array<Comment>;
    relatedPosts: Array<PostPreview>;
    saved: boolean;
}

export default class MobilePost extends React.Component<MobilePostProps, MobilePostState> {
    static contextTypes: AppContext;

    state: MobilePostState = {
        section: TabbedSectionTypes.PRODUCTS_IN_THIS_POST,
        tabbedContent: this.props.post.products,
        comments: [],
        relatedPosts: [],
        saved: this.props.post.wishlisted,
    };

    async componentWillMount() {
        this._postId = this.props.post.id;
        this._postViewRef = React.createRef();
        this._nextPostRef = React.createRef();

        const relatedPosts = await this.context.api.getRelatedPosts(this._postId);
        this.setState({ relatedPosts });
    }

    render() {
        const {
            post,
        } = this.props;

        return (
            <div className="mobile-post" ref={this._postViewRef}>
                <div className="post-content">
                    {post.cover_image && (
                        <Image
                            className="post-cover"
                            width={post.cover_image.original_image_width}
                            height={post.cover_image.original_image_height}
                            src={post.cover_image.small_image_url}
                            previewSrc={post.cover_image.thumbnail_image_url}
                        />
                    )}
                    <p className="post-title">
                        {post.title}
                    </p>
                    <div className="post-subtitle">
                        <PostAuthorDetails
                            author={post.author}
                            iconSize={isMobile ? IconSize.MEDIUM : IconSize.LARGE}
                            postDate={new Date(post.created)}
                            postId={post.id}
                            wishlisted={this.state.saved}
                            toggleWishlist={this._toggleWishlist}
                        />
                    </div>
                    <div className="post-details">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>
                <TabbedSection
                    selected={this.state.section}
                    sections={[TabbedSectionTypes.PRODUCTS_IN_THIS_POST, TabbedSectionTypes.YOU_MAY_ALSO_LIKE]}
                    onSectionChange={this._onSectionChange}
                >
                    <Carousel>
                        {this.state.tabbedContent.map(content => (
                            this._renderTabbedContent(content)
                        ))}
                    </Carousel>
                </TabbedSection>
                <ContentSection title="Comments">
                    <Comments
                        comments={this.state.comments}
                        likeComment={this._likeComment}
                        unlikeComment={this._unlikeComment}
                        submitComment={this._submitComment}
                    />
                </ContentSection>
                <div ref={this._nextPostRef}>
                    <div className={`next-post-container${!this.props.isModal ? " full-screen" : ""}${isMobile ? " mobile" : ""}`} ref={this._nextPostRef}>
                        <div className="next-post-text">
                            Next Post
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private _postId: string;
    private _postViewRef: React.RefObject<HTMLDivElement>;
    private _nextPostRef: React.RefObject<HTMLDivElement>;

    private _renderTabbedContent = (content: any) => {
        switch (this.state.section) {
            case TabbedSectionTypes.PRODUCTS_IN_THIS_POST:
                return (
                    <div>
                        <CarouselItem
                            imageUrl={content.image && content.image.thumbnail_image_url}
                            fit={ImageFitVariant.SCALED}
                            redirectUrl={`/product/${content.id}`}
                            newWindowUrl={content.url}
                            title={(content.brand && content.brand.name) || (content.author && content.author.username)}
                            detail={content.title}
                            subdetail={ this._renderProductFooter(content) }
                        />
                    </div>
                );
            case TabbedSectionTypes.YOU_MAY_ALSO_LIKE:
                return (
                    <div className="tabbed-content-carousel-item-container">
                        <CarouselItem
                            className="tabbed-content-carousel-item"
                            imageUrl={content.cover_image && content.cover_image.thumbnail_image_url}
                            redirectUrl={`/post/${content.id}`}
                            title={(content.username) || (content.author && content.author.username)}
                            detail={content.title}
                            subdetail={ this._renderPostFooter(content) }
                        />
                    </div>
                );
        }
    }

    @autobind
    private _onSectionChange(section: TabbedSectionTypes) {
        let tabbedContent;
        switch (section) {
            case TabbedSectionTypes.PRODUCTS_IN_THIS_POST:
                tabbedContent = this.props.post.products;
                break;
            case TabbedSectionTypes.YOU_MAY_ALSO_LIKE:
                tabbedContent = this.state.relatedPosts;
                break;
        }
        this.setState({ tabbedContent, section });
    }

    private _renderPostFooter = (post: PostPreview) => {
        return (
            <>
                <div className="post-card-footer">
                    <ActionLinks
                        iconSize={IconSize.MEDIUM}
                        variant={ActionLinksVariant.POST}
                        id={post.id}
                        wishlisted={post.wishlisted}
                        liked={post.liked}
                        likes={post.likes}
                    />
                </div>
            </>
        );
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
                hideShare
            />
        </div>);
    }

    private _toggleWishlist = () => {
        this.setState({ saved: !this.state.saved });
        if (this.state.saved) {
            this.context.api.unwishlist(this._postId, "blog");
        } else {
            this.context.api.wishlist(this._postId, "blog");
        }
    }

    private _likeComment = (commentId: string) => {
        return this.context.api.likeComment(this._postId, commentId);
    }

    private _unlikeComment = (commentId: string) => {
        return this.context.api.unlikeComment(this._postId, commentId);
    }

    private _submitComment = async (comment: string, parentCommentId: string) => {
        await this.context.api.submitComment(this._postId, comment, parentCommentId);
        const newComments = await this.context.api.getComments(this._postId);
        this.setState({ comments: newComments });
    }
}

MobilePost.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
