import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { ArticleRequest } from "../../api/requests";
import { AppContext } from "../../app";
import Button, { ButtonSize, ButtonVariant } from "../../components/button";
import RouteProps from "../routeProps";
import { PostDraft, PostType } from "./types";

import "./style.scss";

type Props = RouteProps;

interface CMSViewState {
    uploads: Array<any>;
    featured: Array<any>;
    nextToken: string | null;
}

function formatDate(date: Date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export default class CMSView extends React.Component<Props, CMSViewState> {
    static contextTypes: AppContext;

    state: CMSViewState = {
        uploads: [],
        featured: [],
        nextToken: null,
    };

    async componentWillMount() {
        const user = JSON.parse(localStorage.getItem("user"));

        // You should not be able to post if you are not an influencer or admin
        if (user["auth_level"] < 2) {
            this.props.history.push("/");
        }
        this._isManager = user["auth_level"] >= 3;
        this._draft = JSON.parse(localStorage.getItem("post_draft")) as PostDraft;

        if (this._isManager) {
            const content = await this.context.api.getFeaturedPosts();
            const featured = content.filter(post => post.priority_level > 0);
            this.setState({ uploads: content, featured });
            // set uploads as edit/articles
        } else {
            const content = await this.context.api.getPostsForUser(user.id);
            this.setState({ uploads: content.list, nextToken: content.nextToken });
        }
    }

    render() {
        if (isMobile) {
            return <div>Mobile Upload not supported yet. Please use the desktop version of the website </div>;
        }

        return (
            <div className="cms">
                {this._draft && (
                    <div className="draft">
                        <p className="draft-label">
                            You have an unfinished upload
                        </p>
                        <Button variant={ButtonVariant.OUTLINE} onClick={this._editDraft}>Continue</Button>
                    </div>
                )}
                {this._isManager && (
                    <div className="list-container">
                        <h4>Featured Articles</h4>
                        <table>
                            <tr className="header">
                                <th className="order">Order</th>
                                <th className="title">Title</th>
                                <th className="type">Type</th>
                                <th className="actions"></th>
                            </tr>
                            {this.state.featured.map(post => (
                                <tr>
                                    <th className="order">
                                        {post.priority_level > 1 && (
                                            <div onClick={() => this._reorderFeature(post, true)}>Up</div>
                                        )}
                                        {post.priority_level}
                                        {post.priority_level < this.state.featured.length && (
                                            <div onClick={() => this._reorderFeature(post, false)}>Down</div>
                                        )}
                                    </th>
                                    <th className="title">{post.title}</th>
                                    <th className="type">{post.type}</th>
                                    <th className="actions">
                                        <Button inline size={ButtonSize.VERY_SMALL} variant={ButtonVariant.OUTLINE} onClick={() => this._toggleFeature(post)}>
                                            {post.priority_level > 0 ? "Unfeature" : "Feature"}
                                        </Button>
                                        <Button inline size={ButtonSize.VERY_SMALL} variant={ButtonVariant.OUTLINE} url={this._getPreviewUrl(post)}>View</Button>
                                        <Button inline size={ButtonSize.VERY_SMALL} variant={ButtonVariant.OUTLINE} onClick={() => this._editPost(post)}>Edit</Button>
                                    </th>
                                </tr>
                            ))}
                        </table>
                    </div>
                )}
                <div className="list-container">
                    <h4>Uploads</h4>
                    <div className="create-new-container">
                        {this._isManager ? (
                            <>
                                <Button inline size={ButtonSize.SMALL} onClick={() => this._createNew(PostType.ARTICLE)}>Create New Article</Button>
                                <Button inline size={ButtonSize.SMALL} onClick={() => this._createNew(PostType.COLLECTION)}>Create New Collection</Button>
                            </>
                        ) : (
                            <Button inline size={ButtonSize.SMALL} onClick={() => this._createNew(PostType.BLOG)}>Create New Blog</Button>
                        )}
                    </div>
                    <table>
                        <tr className="header">
                            <th className="title">Title</th>
                            <th>Date</th>
                            <th className="actions"></th>
                        </tr>
                        {this.state.uploads.map(post => (
                            <tr>
                                <th className="title">{post.title}</th>
                                <th>{formatDate(new Date(post.created))}</th>
                                <th className="actions">
                                    {this._isManager && (
                                        <Button inline size={ButtonSize.VERY_SMALL} variant={ButtonVariant.OUTLINE} onClick={() => this._toggleFeature(post)}>
                                            {post.priority_level > 0 ? "Unfeature" : "Feature"}
                                        </Button>
                                    )}
                                    <Button inline size={ButtonSize.VERY_SMALL} variant={ButtonVariant.OUTLINE} url={this._getPreviewUrl(post)}>View</Button>
                                    <Button inline size={ButtonSize.VERY_SMALL} variant={ButtonVariant.OUTLINE} onClick={() => this._editPost(post)}>Edit</Button>
                                </th>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        );
    }

    private _isManager: boolean;
    private _draft: PostDraft;

    private _getPreviewUrl = (post) => {
        if (this._isManager) {
            return post.cta_url || `/article/${post.id}`;
        } else {
            return `/post/${post.id}`;
        }
    }

    private _editPost = (post) => {
        if (this._isManager) {
            switch (post.type.toLowerCase()) {
                case PostType.ARTICLE:
                    this.props.history.push(`/upload/article/${post.id}`);
                    break;
                case PostType.COLLECTION:
                    this.props.history.push(`/upload/result/${post.id}`);
            }
        } else {
            this.props.history.push(`/upload/blog/${post.id}`);
        }
    }

    private _reorderFeature = (post, up) => {
        const maxPriorityLevel = this.state.featured.reduce((level, current) => {
            if (current.priority_level > level) {
                return current.priority_level;
            }
            return level;
        }, 0);
        let priorityLevel;
        if (post.priority_level === 0) {
            priorityLevel = maxPriorityLevel + 1;
        } else {
            priorityLevel = up ? post.priority_level - 1 : post.priority_level + 1;
        }
        const swap = this.state.featured.find(f => f.priority_level === priorityLevel);
        this._setPriorityLevel(post, priorityLevel);
        if (swap) {
            this._setPriorityLevel(swap, up ? swap.priority_level + 1 : swap.priority_level - 1);
            this._swapPriority(post, swap);
        }
    }

    private _swapPriority = (post1, post2) => {
        const index1 = this.state.featured.findIndex(featured => featured.id === post1.id);
        const index2 = this.state.featured.findIndex(featured => featured.id === post2.id);
        const featured = this.state.featured;
        featured[index1] = post2;
        featured[index2] = post1;
        this.setState({ featured });
    }

    private _setPriorityLevel = (post, priorityLevel) => {
        let request;
        if (post.type.toLowerCase() === PostType.ARTICLE) {
            request = {
                type: post.type,
                title: post.title,
                caption: post.caption,
                content: post.content,
                tag_list: post.tag_list,
                occasion_tag_list: post.occasion_tag_list,
                style_tag_list: post.style_tag_list,
                cover_image_url: post.cover_image.original_image_url,
                priority_level: priorityLevel,
                cta_url: post.cta_url,
            } as ArticleRequest;
        }
        this.context.api.updateFeaturedPost(post.id, request);
        let featured = this.state.featured;
        if (priorityLevel === 0) {
            featured = this.state.featured.filter(featured => featured.id !== post.id);
        } else if (!featured.find(f => f.id === post.id)) {
            featured.push(post);
        }
        const uploads = this.state.uploads.map(upload => {
            if (upload.id === post.id) {
                const newUpload = upload;
                newUpload.priority_level = priorityLevel;
                return newUpload;
            } else {
                return upload;
            }
        });
        this.setState({ uploads, featured });
    }

    private _toggleFeature = (post) => {
        if (post.priority_level === 0) {
            this._reorderFeature(post, true);
        } else {
            this._setPriorityLevel(post, 0);
        }
    }

    private _createNew = (postType: PostType) => {
        localStorage.removeItem("post_draft");
        switch (postType) {
            case PostType.ARTICLE:
                this.props.history.push("/upload/article");
                return;
            case PostType.BLOG:
                this.props.history.push("/upload/blog");
                return;
            case PostType.COLLECTION:
                this.props.history.push("/upload/cta");
                return;
        }
    }

    private _editDraft = () => {
        switch (this._draft.type) {
            case PostType.ARTICLE:
                this.props.history.push("/upload/article");
                return;
            case PostType.BLOG:
                this.props.history.push("/upload/blog");
                return;
            case PostType.COLLECTION:
                this.props.history.push("/upload/result");
                return;
        }
    }
}

CMSView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
