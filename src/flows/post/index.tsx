import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
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
import Spinner, { SpinnerContainer } from "../../components/spinner";
import ActionLinks, {ActionLinksVariant} from "../flowComponents/actions";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import PageNavigation from "../flowComponents/pageNavigation";
import { PostRank } from "../flowComponents/ranking";
import { ContentSection, SidebarSection } from "../flowComponents/section";
import SidebarGrid from "../flowComponents/sidebarGrid";
import Tag from "../flowComponents/tag";
import RouteProps from "../routeProps";
import DesktopPost from "./desktop";
import MobilePost from "./mobile";
import PostAuthorDetails from "./postAuthorDetails";
import ProductTag from "./productTag";

import "./style.scss";

type Props = RouteProps;

interface PostState {
    post: Post;
    comments: Array<Comment>;
    relatedProducts: Array<any>;
    relatedPosts: Array<Post>;
    featuredTrendnines: Array<Person>;
    isLoading: boolean;
    wishlisted: boolean;
    liked: boolean;
    likes: number;
}

export default class PostView extends React.Component<Props, PostState> {
    static contextTypes: AppContext;

    state: PostState = {
        post: null,
        comments: [],
        relatedProducts: [],
        relatedPosts: [],
        featuredTrendnines: [],
        isLoading: true,
        wishlisted: false,
        liked: false,
        likes: 0,
    };

    componentWillMount() {
        this._fetchData();
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.location !== this.props.location) {
            this._fetchData();
        }
    }

    render() {
        if (this.state.isLoading) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        return (
            <div>
                <PageNavigation />
                <BrowserView device={isBrowser}>
                    <DesktopPost
                        {...this.state}
                        likeComment={this._likeComment}
                        unlikeComment={this._unlikeComment}
                        submitComment={this._submitComment}
                        updatePostProductTags={this._submitProductTagsChange}
                        toggleWishlist={this._toggleWishlist}
                        toggleLike={this._toggleLike}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobilePost
                        {...this.state}
                        likeComment={this._likeComment}
                        unlikeComment={this._unlikeComment}
                        submitComment={this._submitComment}
                        toggleWishlist={this._toggleWishlist}
                        toggleLike={this._toggleLike}
                    />
                </MobileView>
            </div>
        );
    }

    private _postId: string;

    private _toggleWishlist = () => {
        this.setState({ wishlisted: !this.state.wishlisted });
        if (this.state.wishlisted) {
            this.context.api.unwishlist(this._postId, "blog");
        } else {
            this.context.api.wishlist(this._postId, "blog");
        }
    }

    private _toggleLike = () => {
        if (this.state.liked) {
            this.context.api.unlikePost(this._postId);
            this.setState({ liked: false, likes: this.state.likes - 1 });
        } else {
            this.context.api.likePost(this._postId);
            this.setState({ liked: true, likes: this.state.likes + 1 });
        }
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
    private _submitProductTagsChange(postId: string, productTags: Array<any>) {
        return this.context.api.updatePostProductTags(postId, productTags);
    }

    @autobind
    private async _fetchData() {
        this._postId = this.props.match.params.postId;
        try {
            const [
                post,
                comments,
                relatedProducts,
                relatedPosts,
                featuredTrendnines,
            ] = await Promise.all([
                this.context.api.getPost(this._postId),
                this.context.api.getComments(this._postId),
                this.context.api.getRelatedProducts(),
                this.context.api.getRelatedPosts(this._postId),
                this.context.api.getFeaturedTrendnines(),
            ]);

            const recentlyViewed = localStorage.getItem("recentlyViewed");
            let recentlyViewedArray = JSON.parse(recentlyViewed);

            if (!recentlyViewedArray || recentlyViewedArray.length < 1) {
                recentlyViewedArray = [{ type: "post", content: post }];
            } else {
                const indexOfPost = recentlyViewedArray.findIndex(recent => recent.content.id === post.id);

                if (indexOfPost !== -1) {
                    recentlyViewedArray.splice(indexOfPost, 1);
                }

                recentlyViewedArray.unshift({ type: "Post", content: post});
            }

            this.setState({
                post,
                comments,
                relatedProducts,
                relatedPosts,
                featuredTrendnines,
                isLoading: false,
                wishlisted: post.wishlisted,
                liked: post.liked,
                likes: post.likes,
            });
            localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewedArray.slice(0, 5)));
        } catch (err) {
            throw new Error(err);
        }
    }
}

PostView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

