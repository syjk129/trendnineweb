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
    currentPost: Post;
    posts: Array<Post>;
    nextPosts: Array<PostPreview>;
    isLoading: boolean;
    loadingNext: boolean;
}

export default class PostView extends React.Component<PostProps, PostState> {
    static contextTypes: AppContext;

    state: PostState = {
        currentPost: null,
        posts: [],
        nextPosts: [],
        isLoading: false,
        loadingNext: false,
    };

    async componentWillMount() {
        this._isModal = this.props.location.state && this.props.location.state.modal;
        this._pageRef = React.createRef();
        this._scrollRef = React.createRef();
        await this._fetchData(this.props);

        if (isMobile && this._isModal) {
            this._scrollListener = this._pageRef.current;
        } else if (this._isModal) {
            this._scrollListener = this._scrollRef.current;
        } else {
            this._scrollListener = document;
        }
        this._scrollListener.addEventListener("scroll", this._populateNextPost);
        this._scrollListener.addEventListener("touchmove", this._populateNextPost);
    }

    componentWillUnmount() {
        this._scrollListener.removeEventListener("scroll", this._populateNextPost);
        this._scrollListener.removeEventListener("touchmove", this._populateNextPost);
    }

    componentWillReceiveProps(nextProps: PostProps) {
        if (nextProps.location.state && nextProps.location.state.clearData) {
            this.setState({
                posts: [],
                currentPost: null,
                nextPosts: [],
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

        return (
            <ContainerEl {...props} isOpen>
                {/* {this._populateHead()} */}
                <PageNavigation />
                {this.state.isLoading && (
                    <Spinner />
                )}
                {this.state.posts.map(post => (
                    <>
                        {isMobile ? (
                            <MobilePost
                                post={post}
                                setCurrentPost={() => this._setCurrentPost(post)}
                                scrollRef={this._scrollRef}
                                isModal={this._isModal}
                            />
                        ) : (
                            <DesktopPost
                                post={post}
                                setCurrentPost={() => this._setCurrentPost(post)}
                                scrollRef={this._scrollRef}
                                isModal={this._isModal}
                            />
                        )}
                    </>
                ))}
                {this.state.loadingNext && <Spinner/>}
            </ContainerEl>
        );
    }

    private _scrollRef: React.RefObject<HTMLDivElement>;
    private _pageRef: React.RefObject<HTMLDivElement>;
    private _scrollListener: any;
    private _isModal: boolean;

    private _fetchData = async (props: PostProps) => {
        this.setState({ isLoading: true });

        const [
            post,
            nextPosts,
        ] = await Promise.all([
            this.context.api.getPost(props.match.params.postId),
            this.context.api.getLatestPosts(),
        ]);

        this.setState({
            posts: [post],
            currentPost: post,
            nextPosts: nextPosts.list,
            isLoading: false,
        });
    }

    private _setCurrentPost = (post: Post) => {
        if (this.state.currentPost.id !== post.id) {
            this.setState({ currentPost: post });
            this.props.history.push({
                pathname: `/post/${post.id}`,
                state: {
                    modal: this._isModal,
                    noScroll: true,
                },
            });
        }
    }

    private _populateNextPost = async () => {
        if (!this.state.loadingNext) {
            const page = this._pageRef.current;
            if (!page || page.getBoundingClientRect().bottom > window.innerHeight + 500) {
                return;
            }
            let nextPosts = this.state.nextPosts;
            const nextPost = this.state.nextPosts.pop();
            if (!nextPost) {
                return;
            }
            this.setState({ loadingNext: true });
            const post = await this.context.api.getPost(nextPost.id);
            // const post = await this.context.api.getPost();
            let posts = this.state.posts;
            posts.push(post);
            this.setState({ posts, loadingNext: false, nextPosts });
        }
    }

    private _getPostContentPreview = (content: string) => {
        const span = document.createElement("span");
        span.innerHTML = content;
        return span.textContent || span.innerText;
    }

    private _populateHead = async () => {
        const post = await this.context.api.getPost(this.props.match.params.postId);
        const postContentPreview = this._getPostContentPreview(post.content).trim().slice(0, 300);
        const postPreviewTitle = `${post.author ? `@${post.author.username} | ` : ""}${post.title}`;
        const postPreviewDescription = postContentPreview.length > 0 ? postContentPreview : "TrendNine | Discover & Shop the Looks from Fashion Influencers";

        return (
            <Helmet defer={false}>
                <html prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#" />
                <meta name="description" content={post.title} />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="trendnine.com" />
                <meta name="twitter:title" content={postPreviewTitle} />
                <meta name="twitter:description" content={postPreviewDescription} />
                <meta name="twitter:creator" content={post.author && `@${post.author.username}`} />
                <meta name="twitter:image:src" content={post.cover_image && post.cover_image.small_image_url} />

                {/* Open Graph Tags */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://www.trendnine.com/post/${post.id}`} />
                <meta property="og:image" content={post.cover_image && post.cover_image.small_image_url} />
                <meta property="og:image:width" content={post.cover_image && `${post.cover_image.original_image_width}`} />
                <meta property="og:image:height" content={post.cover_image && `${post.cover_image.original_image_height}`} />
                <meta property="og:title" content={postPreviewTitle} />
                <meta property="og:description" content={postPreviewDescription} />
                {/* <meta property="article:author" content={post.author && `@${post.author.username}`} /> */}
                <meta property="article:author" content="https://www.facebook.com/trendnine" />
                <meta property="article:section" content="Fashion" />
                {post.tags.map(tag => (
                    <meta property="article:tag" content={tag.content} />
                ))}
                <meta property="og:site_name" content="TrendNine" />
                <script type="ld+json">
                    {
                        `
                            "@context": "http://schema.org/",
                            "@type": "Article",
                            "name": "${postPreviewTitle}",
                            "author": "${post.author && post.author.username}",
                            "image": "${post.cover_image && post.cover_image.small_image_url}",
                            "description": "${postPreviewDescription}"
                        `
                    }
                </script>
            </Helmet>
        );
    }
}

PostView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

