import { PropTypes } from "prop-types";
import * as React from "react";
import { withRouter } from "react-router-dom";

import { Comment, Post, PostPreview, Product } from "../../api/models";
import { AppContext } from "../../app";
import Button, { ButtonVariant, IconButton } from "../../components/button";
import Callout, { CalloutVariant } from "../../components/callout";
import { CardContainer } from "../../components/card";
import Content from "../../components/content";
import Icon, { IconSize, IconVariant } from "../../components/icon";
import Image from "../../components/image";
import Sticky from "../../components/sticky";
import formatTime from "../../util/formatTime";
import LookCard from "../flowComponents/cardView/lookCard";
import Comments from "../flowComponents/comments";
import { ContentSection } from "../flowComponents/section";
import RouteProps from "../routeProps";

interface PostViewProps extends RouteProps {
    isManager?: boolean;
    post: Post;
    relatedPosts: Array<PostPreview>;
    scrollRef: React.RefObject<HTMLDivElement>;
    isModal: boolean;
    redirectProduct(product: Product): void;
}

interface DesktopPostViewState {
    comments: Array<Comment>;
    saved: boolean;
    authorPosts: Array<PostPreview>;
}

class DesktopPostView extends React.Component<PostViewProps, DesktopPostViewState> {
    static contextTypes: AppContext;

    state: DesktopPostViewState = {
        comments: [],
        saved: false,
        authorPosts: [],
    };

    async componentWillMount() {
        this._postId = this.props.post.id;
        this._postViewRef = React.createRef();
        this._nextPostRef = React.createRef();

        const [
            authorPosts,
        ] = await Promise.all([
            this.context.api.getPostsForUser(this.props.post.author.id),
        ]);
        this.setState({ authorPosts: authorPosts.list });
    }

    render() {
        let shareUrl;
        const pathname = window.location.pathname.split("/").filter(path => path !== "");
        if (pathname.length === 2) {
            shareUrl = `${window.location.pathname}/share`;
        } else {
            shareUrl = `/share/post/${this._postId}`;
        }

        return (
            <div className="post-view-container">
                <div className="post" ref={this._postViewRef}>
                    <Content>
                        <div className="post-content" ref="cover">
                            <div className="post-header">
                                <div>
                                    <div className="iconed-callout">
                                        <Icon variant={IconVariant.LOOKS} />
                                        <Callout inline>Looks</Callout>
                                    </div>
                                    <Callout inline variant={CalloutVariant.MUTED}>{formatTime(this.props.post.created)}</Callout>
                                </div>
                                <IconButton
                                    icon={IconVariant.SHARE}
                                    size={IconSize.LARGE}
                                    onClick={() => this.props.history.push(shareUrl)}
                                />
                            </div>
                            <h2 className="post-title">{this.props.post.title}</h2>
                            <Image
                                className="post-cover"
                                width={this.props.post.cover_image.original_image_width}
                                height={this.props.post.cover_image.original_image_height}
                                src={this.props.post.cover_image.original_image_url}
                                previewSrc={this.props.post.cover_image.thumbnail_image_url}
                            />
                            <div className="post-details">
                                <div dangerouslySetInnerHTML={{ __html: this.props.post.content }} />
                            </div>
                        </div>
                        <Comments
                            comments={this.state.comments}
                            likeComment={this._likeComment}
                            unlikeComment={this._unlikeComment}
                            submitComment={this._submitComment}
                        />
                    </Content>
                    <div className="post-sidebar">
                        {this.props.post.products.length > 0 && (
                            <Sticky
                                id="recently-viewed-section"
                                stickyClassName="sticky-sidebar-recently-viewed"
                                bottomEl={this._nextPostRef}
                                scrollRef={this.props.scrollRef}
                                maxTop={this.props.isModal ? 0 : null}
                            >
                                <div>
                                    <div className="user-more">
                                        <div className="user-follow-container">
                                            <div className="user-details">
                                                <img className="user-image" src={this.props.post.author.profile_small_image_url} />
                                                <div className="username">
                                                    <p className="more-from">More from</p>
                                                    <b>{this.props.post.author.username}</b>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="user-posts">
                                            {this.state.authorPosts.slice(0, 3).map(post => (
                                                <Image square src={post.cover_image.thumbnail_image_url} />
                                            ))}
                                        </div>
                                        <Button className="user-follow" variant={ButtonVariant.OUTLINE}>FOLLOW</Button>
                                    </div>
                                    <Callout>Products in this post</Callout>
                                    {this.props.post.products.map(product => (
                                        <div className="sidebar-product" onClick={() => this.props.redirectProduct(product)}>
                                            <img className="sidebar-product-image" src={product.image && product.image.thumbnail_image_url} />
                                            <div className="sidebar-product-details">
                                                <b>{product.brand && product.brand.name}</b>
                                                <div className="sidebar-product-name">
                                                    {product.title}
                                                </div>
                                                <div className="price">
                                                    ${product.price}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Sticky>
                        )}
                    </div>
                </div>
                <div ref={this._nextPostRef}>
                    <Callout>Related Looks</Callout>
                    <CardContainer>
                        {this.props.relatedPosts.map(post => (
                            <LookCard look={post} />
                        ))}
                    </CardContainer>
                </div>
            </div>
        );
    }

    private _postId: string;
    private _postViewRef: React.RefObject<HTMLDivElement>;
    private _nextPostRef: React.RefObject<HTMLDivElement>;

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

DesktopPostView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export default withRouter(DesktopPostView);
