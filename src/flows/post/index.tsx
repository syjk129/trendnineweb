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
import ActionLinks, {ActionLinksVariant} from "../flowComponents/actions";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import { PostRank } from "../flowComponents/ranking";
import { ContentSection, SidebarSection } from "../flowComponents/section";
import SidebarGrid from "../flowComponents/sidebarGrid";
import Tag from "../flowComponents/tag";
import DesktopPost from "./desktop";
import MobilePost from "./mobile";
import PostAuthorDetails from "./postAuthorDetails";
import ProductTag from "./productTag";

import "./style.scss";

interface PostProps {
    match: match<any>;
}

interface PostState {
    post: Post;
    comments: Array<Comment>;
    relatedProducts: Array<any>;
    relatedPosts: Array<Post>;
    featuredTrendnines: Array<Person>;
}

export default class PostView extends React.Component<PostProps, PostState> {
    static contextTypes: AppContext;

    state: PostState = {
        post: null,
        comments: [],
        relatedProducts: [],
        relatedPosts: [],
        featuredTrendnines: [],
    };

    async componentWillMount() {
        this._fetchData();
    }

    async componentWillReceiveProps() {
        this._fetchData();
    }

    render() {
        const { post, comments, relatedProducts, relatedPosts } = this.state;

        if (!post || !comments || !relatedPosts || !relatedProducts) {
            return "Loading";
        }

        return (
            <div>
                <BrowserView device={isBrowser}>
                    <DesktopPost
                        {...this.state}
                        likeComment={this._likeComment}
                        unlikeComment={this._unlikeComment}
                        submitComment={this._submitComment}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobilePost
                        {...this.state}
                        likeComment={this._likeComment}
                        unlikeComment={this._unlikeComment}
                        submitComment={this._submitComment}
                    />
                </MobileView>
            </div>
        );
    }

    private _postId: string;
    private _imageRef: any;

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
    private async _fetchData() {
        this._postId = this.props.match.params.postId;
        this.setState({
            post: null,
            comments: [],
            relatedProducts: [],
            relatedPosts: [],
            featuredTrendnines: [],
        });

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

            this.setState({ post, comments, relatedProducts, relatedPosts, featuredTrendnines });
        } catch (err) {
            throw new Error(err);
        }
    }
}

PostView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};

