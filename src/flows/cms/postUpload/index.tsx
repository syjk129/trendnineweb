import { PropTypes } from "prop-types";
import * as React from "react";

import { PresignedPostRequest } from "../../../api/requests";
import { AppContext } from "../../../app";
import { ImageUploadButton } from "../../../components/button";
import Input from "../../../components/input";
import RouteProps from "../../routeProps";
import PostEditor from "../postEditor";
import { PostDraft, PostFieldType, PostType } from "../types";
import getUploadRequirements, { PostField } from "./requirements";

import "./style.scss";

interface PostUploadProps extends RouteProps {
}

interface PostUploadState extends PostDraft {
    processingCoverImage: boolean;
    // editorState: EditorState;
    editorState: string;
}

export default class PostUpload extends React.Component<PostUploadProps, PostUploadState> {
    static contextTypes: AppContext;

    state: PostUploadState = {
        type: null,
        title: "",
        tags: null,
        content: null,
        coverImage: null,
        previewImage: null,
        processingCoverImage: false,
        editorState: "",
    };

    componentWillMount() {
        this._postType = this.props.match.params.postType;

        // Redirect to cms page if post type doesn't exist
        if (!Object.keys(PostType).some(type => this._postType === PostType[type])) {
            this.props.history.push("/cms");
        }

        this._postFields = getUploadRequirements(this._postType);
        const postDraft = JSON.parse(localStorage.getItem("post_draft")) as PostDraft;
        if (postDraft) {
            this.setState({ ...postDraft });
        } else {
            localStorage.setItem("post_draft", JSON.stringify({
                type: this._postType,
                title: this.state.title,
                tags: this.state.tags,
                content: this.state.content,
                coverImage: this.state.coverImage,
                previewImage: this.state.previewImage,
            }));
            this.setState({ type: this._postType });
        }
    }

    render() {
        return (
            <div className="post-upload">
                {this._hasFieldType(PostFieldType.TITLE) && (
                    <div>
                        Title*
                        <Input value={this.state.title} placeholder="Title" onChange={this._onTitleChange} />
                    </div>
                )}
                {/* {this._hasFieldType(PostFieldType.CAPTION) && (
                    <div>
                        caption
                    </div>
                )} */}
                {this._hasFieldType(PostFieldType.COVER_IMAGE) && (
                    <div>
                        cover_image
                        <ImageUploadButton
                            isProcessing={this.state.processingCoverImage}
                            setProcessing={this._setCoverImageProcessing}
                            setImage={this._setCoverImage}
                        />
                        {this.state.coverImage}
                    </div>
                )}
                {/* {this._hasFieldType(PostFieldType.PREVIEW_IMAGE) && (
                    <div>
                        preview_image
                    </div>
                )} */}
                {this._hasFieldType(PostFieldType.TAGS) && (
                    <div>
                        Tags
                        <Input value={this.state.tags} placeholder="Tags" onChange={this._onTagsChange} />
                    </div>
                )}
                {/* {this._hasFieldType(PostFieldType.STYLES) && (
                    <div>
                        styles
                    </div>
                )}
                {this._hasFieldType(PostFieldType.OCCASIONS) && (
                    <div>
                        occasions
                    </div>
                )} */}
                {this._hasFieldType(PostFieldType.CONTENT) && (
                    <div>
                        content
                        <PostEditor
                            editorState={this.state.editorState}
                            onChange={this._onContentChange}
                            getPresignedPost={this._getPresignedPost}
                        />
                    </div>
                )}
                {/* {this._hasFieldType(PostFieldType.CTA_URL) && (
                    <div>
                        cta_url
                    </div>
                )} */}
            </div>
        );
    }

    private _postType: PostType;
    private _postFields: Array<PostField>;

    private _hasFieldType = (postFieldType: PostFieldType) => {
        return this._postFields.some(postField => postField.type === postFieldType);
    }

    private _onTitleChange = (title: string) => {
        this.setState({ title });
        let post = JSON.parse(localStorage.getItem("post_draft")) as PostDraft;
        post.title = title;
        localStorage.setItem("post_draft", JSON.stringify(post));
    }

    private _onTagsChange = (tags: string) => {
        this.setState({ tags });
        let post = JSON.parse(localStorage.getItem("post_draft")) as PostDraft;
        post.tags = tags;
        localStorage.setItem("post_draft", JSON.stringify(post));
    }

    private _setCoverImageProcessing = (isProcessing: boolean) => {
        this.setState({ processingCoverImage: isProcessing });
    }

    private _setCoverImage = (imageUrl: string) => {
        this.setState({ coverImage: imageUrl });
        let post = JSON.parse(localStorage.getItem("post_draft")) as PostDraft;
        post.coverImage = imageUrl;
        localStorage.setItem("post_draft", JSON.stringify(post));
    }

    private _onContentChange = (editorState: string) => {
        this.setState({ editorState });
    }

    private _getPresignedPost = (request: PresignedPostRequest) => {
        return this.context.api.getPresignedPost(request);
    }
}

PostUpload.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
