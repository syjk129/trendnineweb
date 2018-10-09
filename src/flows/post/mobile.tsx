import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { Link } from "react-router-dom";

import { Comment, Post, PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import Callout, { CalloutVariant } from "../../components/callout";
import { CardContainer } from "../../components/card";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Image, { ImageFitVariant } from "../../components/image";
import formatTime from "../../util/formatTime";
import { LookCard, ShopCard } from "../flowComponents/cardView";
import Comments from "../flowComponents/comments";
import { ContentSection } from "../flowComponents/section";
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

        const relatedPosts = await this.context.api.getRelatedPosts(this._postId);
        this.setState({ relatedPosts });
    }

    render() {
        const {
            post,
        } = this.props;

        return (
            <div className="mobile-post">
                <div>
                    <div className="iconed-callout">
                        <Icon variant={IconVariant.LOOKS} />
                        <Callout inline>Looks</Callout>
                    </div>
                    <Callout inline variant={CalloutVariant.MUTED}>{formatTime(post.created)}</Callout>
                </div>
                <p className="post-title">
                    {post.title}
                </p>
                <Link to={`/user/${this.props.post.author.username}`} className="user-more mobile">
                    <div className="user-details">
                        <img className="user-image" src={this.props.post.author.profile_small_image_url} />
                        <div className="username">
                            <b>{this.props.post.author.username}</b>
                        </div>
                    </div>
                </Link>
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
                    <div className="post-details">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>
                <Callout>Products in this Post</Callout>
                <div className="products-in-post">
                    {this.props.post.products.map(product => (
                        <ShopCard product={product} />
                    ))}
                </div>
                <ContentSection title="Comments">
                    <Comments
                        comments={this.state.comments}
                        likeComment={this._likeComment}
                        unlikeComment={this._unlikeComment}
                        submitComment={this._submitComment}
                    />
                </ContentSection>
                <Callout>Related Looks</Callout>
                <CardContainer gridSize={2}>
                    {this.state.relatedPosts.map(post => (
                        <LookCard look={post} />
                    ))}
                </CardContainer>
            </div>
        );
    }

    private _postId: string;

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
