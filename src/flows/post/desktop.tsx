import { PropTypes } from "prop-types";
import * as React from "react";
import Slider from "react-slick";

import { Comment, Post, PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import { IconButton } from "../../components/button";
import Content from "../../components/content";
import { IconSize, IconVariant } from "../../components/icon";
import Image from "../../components/image";
import Sticky from "../../components/sticky";
import { PostCard } from "../flowComponents/cardView";
import Comments from "../flowComponents/comments";
import { ContentSection, SidebarPostProductListSection } from "../flowComponents/section";
import PostAuthorDetails from "./postAuthorDetails";

interface PostViewProps {
    isManager?: boolean;
    post: Post;
    scrollRef: React.RefObject<HTMLDivElement>;
    isModal: boolean;
    setCurrentPost(): void;
}

interface DesktopPostViewState {
    comments: Array<Comment>;
    relatedPosts: Array<PostPreview>;
    saved: boolean;
}

export default class DesktopPostView extends React.Component<PostViewProps, DesktopPostViewState> {
    static contextTypes: AppContext;

    state: DesktopPostViewState = {
        comments: [],
        relatedPosts: [],
        saved: false,
    };

    async componentWillMount() {
        this._postId = this.props.post.id;
        this._postViewRef = React.createRef();
        this._nextPostRef = React.createRef();

        if (this.props.scrollRef && this.props.scrollRef.current) {
            this.props.scrollRef.current.addEventListener("scroll", this._onScroll);
            this.props.scrollRef.current.addEventListener("touchmove", this._onScroll);
        } else {
            document.addEventListener("scroll", this._onScroll);
            document.addEventListener("touchmove", this._onScroll);
        }
        const relatedPosts = await this.context.api.getRelatedPosts(this._postId);
        this.setState({ relatedPosts });
    }

    componentWillUnmount() {
        if (this.props.scrollRef && this.props.scrollRef.current) {
            this.props.scrollRef.current.removeEventListener("scroll", this._onScroll);
            this.props.scrollRef.current.removeEventListener("touchmove", this._onScroll);
        } else {
            document.removeEventListener("scroll", this._onScroll);
            document.removeEventListener("touchmove", this._onScroll);
        }
    }

    render() {
        return (
            <div className="post-view-container">
                <div className="post" ref={this._postViewRef}>
                    <Content>
                        <div className="post-content" ref="cover">
                            <Image
                                className="post-cover"
                                width={this.props.post.cover_image.original_image_width}
                                height={this.props.post.cover_image.original_image_height}
                                src={this.props.post.cover_image.original_image_url}
                                previewSrc={this.props.post.cover_image.thumbnail_image_url}
                            />
                            <p className="post-title">
                                {this.props.post.title}
                            </p>
                            <div className="post-subtitle">
                                <PostAuthorDetails
                                    author={this.props.post.author}
                                    iconSize={IconSize.LARGE}
                                    postDate={new Date(this.props.post.created)}
                                    postId={this.props.post.id}
                                    wishlisted={this.state.saved}
                                    toggleWishlist={this._toggleWishlist}
                                />
                            </div>
                            <div className="post-details">
                                {/* TODO: Don't use dangerouslySetInnerHTML. Make this safer */}
                                <div dangerouslySetInnerHTML={{ __html: this.props.post.content }} />
                            </div>
                        </div>
                        <ContentSection title="Comments">
                            <Comments
                                comments={this.state.comments}
                                likeComment={this._likeComment}
                                unlikeComment={this._unlikeComment}
                                submitComment={this._submitComment}
                            />
                        </ContentSection>
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
                                <SidebarPostProductListSection
                                    title="Products in This Post"
                                    items={this.props.post.products.map(product => ({
                                        type: "Product",
                                        content: product,
                                    }))}
                                />
                            </Sticky>
                        )}
                    </div>
                </div>
                <div ref={this._nextPostRef}>
                    {this.state.relatedPosts && (
                        this._renderRelatedPosts()
                    )}
                    <div className={`next-post-container${!this.props.isModal ? " full-screen" : ""}`} ref={this._nextPostRef}>
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

    private _renderRelatedPosts = () => {
        const settings = {
            arrows: true,
            prevArrow: <IconButton icon={IconVariant.ARROW_LEFT} />,
            nextArrow: <IconButton icon={IconVariant.ARROW_RIGHT} />,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            variableWidth: false,
            centerMode: true,
            responsive: [{
                breakpoint: 1543,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 2,
                },
            }],
        };

        return (
            <ContentSection title="You May Also Like">
                <Slider {...settings} className="related-post-container">
                    {this.state.relatedPosts && this.state.relatedPosts.map(post => (
                        <div>
                            <PostCard post={post} noHover clearData />
                        </div>
                    ))}
                </Slider>
            </ContentSection>
        );
    }

    private _onScroll = () => {
        const postView = this._postViewRef.current;
        if (postView) {
            const rect = postView.getBoundingClientRect();
            if (rect.top > 0 && rect.top < 200 && rect.bottom > 200 || rect.bottom < window.innerHeight - 200 && rect.bottom > 200) {
                this.props.setCurrentPost();
            }
        }
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

DesktopPostView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
