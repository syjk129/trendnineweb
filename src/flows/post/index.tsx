import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { Helmet } from "react-helmet";

import { Post, PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import Modal from "../../components/modal";
import Spinner from "../../components/spinner";
import PageNavigation from "../flowComponents/pageNavigation";
import RouteProps from "../routeProps";
import DesktopPost from "./desktop";
import MobilePost from "./mobile";

import "./style.scss";

interface PostProps extends RouteProps {
    close(): void;
}

interface PostState {
    post: Post;
    relatedPosts: Array<PostPreview>;
    isLoading: boolean;
    loadingNext: boolean;
}

export default class PostView extends React.Component<PostProps, PostState> {
    static contextTypes: AppContext;

    state: PostState = {
        post: null,
        relatedPosts: [],
        isLoading: false,
        loadingNext: false,
    };

    componentWillMount() {
        this._isModal = this.props.location.state && this.props.location.state.modal;
        this._pageRef = React.createRef();
        this._scrollRef = React.createRef();
        this._fetchData(this.props);
    }

    componentWillReceiveProps(nextProps: PostProps) {
        if (nextProps.location.state && nextProps.location.state.clearData && !this.state.isLoading) {
            this.setState({
                post: null,
                loadingNext: false,
            });
            this._fetchData(nextProps);
        }
    }

    render() {
        const ContainerEl = this._isModal ? Modal : "div";
        let props;
        if (this._isModal) {
            props = {
                className: "post-modal",
                contentRef: this._pageRef,
                scrollRef: this._scrollRef,
                close: this.props.close,
                fullScreen: isMobile,
            };
        } else {
            props = { ref: this._pageRef };
        }

        let postContentPreview;
        let postPreviewTitle;
        let postPreviewDescription;
        if (this._post) {
            postContentPreview = this._getPostContentPreview(this._post.content).trim().slice(0, 300);
            postPreviewTitle = `${this._post.author ? `@${this._post.author.username} | ` : ""}${this._post.title}`;
            postPreviewDescription = postContentPreview.length > 0 ? postContentPreview : "TrendNine | Discover & Shop the Looks from Fashion Influencers";
        }

        return (
            <>
                {this._post && (
                    <Helmet defer={false}>
                        <html prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#" />
                        <meta name="description" content={this._post.title} />
                        {/* Twitter */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:site" content="trendnine.com" />
                        <meta name="twitter:title" content={postPreviewTitle} />
                        <meta name="twitter:description" content={postPreviewDescription} />
                        <meta name="twitter:creator" content={this._post.author && `@${this._post.author.username}`} />
                        <meta name="twitter:image:src" content={this._post.cover_image && this._post.cover_image.small_image_url} />

                        {/* Open Graph Tags */}
                        <meta property="og:type" content="article" />
                        <meta property="og:url" content={`https://www.trendnine.com/post/${this._post.id}`} />
                        <meta property="og:image" content={this._post.cover_image && this._post.cover_image.small_image_url} />
                        <meta property="og:image:width" content={this._post.cover_image && `${this._post.cover_image.original_image_width}`} />
                        <meta property="og:image:height" content={this._post.cover_image && `${this._post.cover_image.original_image_height}`} />
                        <meta property="og:title" content={postPreviewTitle} />
                        <meta property="og:description" content={postPreviewDescription} />
                        {/* <meta property="article:author" content={post.author && `@${post.author.username}`} /> */}
                        <meta property="article:author" content="https://www.facebook.com/trendnine" />
                        <meta property="article:section" content="Fashion" />
                        {this._post.tags.map(tag => (
                            <meta property="article:tag" content={tag.content} />
                        ))}
                        <meta property="og:site_name" content="TrendNine" />
                        <script type="ld+json">
                            {
                                `
                                    "@context": "http://schema.org/",
                                    "@type": "Article",
                                    "name": "${postPreviewTitle}",
                                    "author": "${this._post.author && this._post.author.username}",
                                    "image": "${this._post.cover_image && this._post.cover_image.small_image_url}",
                                    "description": "${postPreviewDescription}"
                                `
                            }
                        </script>
                    </Helmet>
                )}
                <ContainerEl {...props} isOpen>
                    <PageNavigation />
                    {this.state.isLoading ? (
                        <Spinner />
                    ) : (
                        isMobile ? (
                            <MobilePost
                                post={this.state.post}
                                scrollRef={this._scrollRef}
                                isModal={this._isModal}
                            />
                        ) : (
                            <DesktopPost
                                post={this.state.post}
                                relatedPosts={this.state.relatedPosts}
                                scrollRef={this._scrollRef}
                                isModal={this._isModal}
                                redirectProduct={this._redirectProduct}
                            />
                        )
                    )}
                    {this.state.loadingNext && <Spinner/>}
                </ContainerEl>
            </>
        );
    }

    private _scrollRef: React.RefObject<HTMLDivElement>;
    private _pageRef: React.RefObject<HTMLDivElement>;
    private _isModal: boolean;
    private _post: Post;

    private _redirectProduct = (product) => {
        this.props.history.push({
            pathname: `/shop/product/${product.id}?referrer_type=post&referrer_id=${this.state.post.id}`,
            state: { refresh: true },
        });
    }

    private _fetchData = async (props: PostProps) => {
        this.setState({ isLoading: true });

        const [
            post,
            relatedPosts,
        ] = await Promise.all([
            this.context.api.getPost(props.match.params.postId),
            this.context.api.getRelatedPosts(props.match.params.postId),
        ]);

        if (!this._post) {
            this._post = post;
        }

        this.setState({
            post,
            relatedPosts: relatedPosts.slice(0, 9),
            isLoading: false,
        });
    }

    private _getPostContentPreview = (content: string) => {
        const span = document.createElement("span");
        span.innerHTML = content;
        return span.textContent || span.innerText;
    }
}

PostView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

