import { PropTypes } from "prop-types";
import * as React from "react";

import { PostTagType, ProductSearchResult } from "../../../api/models";
import {
    ArticleRequest,
    ImageRequest,
    PostRequest,
    PresignedPostRequest,
    ResultRequest,
    TagRequest,
} from "../../../api/requests";
import { AppContext } from "../../../app";
import Button, { ButtonVariant } from "../../../components/button";
import Checkbox from "../../../components/checkbox";
import Input from "../../../components/input";
import ImageUploadModal from "../../flowComponents/imageUploadModal";
import RouteProps from "../../routeProps";
import PostEditor from "../postEditor";
import ProductSearchModal from "../productSearchModal";
import { PostDraft, PostFieldType, PostType, ProductSearchTag } from "../types";
import getUploadRequirements, { PostField } from "./requirements";

import "./style.scss";

type Props = RouteProps;

interface PostUploadState extends PostDraft {
    processingCoverImage: boolean;
    modalOpen: boolean;
    styles: Array<any>;
    occasions: Array<any>;
    images: Array<ImageRequest>;
    errors: Array<any>;
}

export default class PostUpload extends React.Component<Props, PostUploadState> {
    static contextTypes: AppContext;

    state: PostUploadState = {
        type: null,
        title: "",
        caption: "",
        ctaUrl: "",
        tags: null,
        content: null,
        coverImage: null,
        previewImage: null,
        selectedStyles: [],
        selectedOccasions: [],
        processingCoverImage: false,
        productTags: [],
        modalOpen: false,
        styles: [],
        occasions: [],
        images: [],
        errors: [],
    };

    async componentWillMount() {
        this._postType = this.props.match.params.postType.toLowerCase();
        this._postId = this.props.match.params.postId;

        // Redirect to cms page if post type doesn't exist
        if (!Object.keys(PostType).some(type => this._postType === PostType[type])) {
            this.props.history.push("/cms");
            return;
        }

        this._postFields = getUploadRequirements(this._postType);
        const postDraft = JSON.parse(localStorage.getItem("post_draft")) as PostDraft;

        if (this._postId) { // Update Flow
            // const post = await this.context.api.getPost(this._postId);
            // const productTags = post.product_tags.map(tag => {
            //     const product = post.products.find(product => product.id === tag.product_id);
            //     if (product) {
            //         return {
            //             id: product.id,
            //             brand: product.brand && product.brand.name,
            //             merchant: product.merchant && product.merchant.name,
            //             category: product.category && product.category.display_name,
            //             title: product.title,
            //             price: product.price,
            //             image: product.image && product.image.original_image_url,
            //             url: product.url,
            //         } as ProductSearchTag;
            //     }
            // });
            // this.setState({
            //     type: this._postType,
            //     title: post.title,
            //     content: post.content,
            //     coverImage: post.cover_image.original_image_url,
            //     tags: post.tags.reduce((result, tag) => result ? `${result},${tag.content}` : tag.content, ""),
            //     productTags,
            // });
            // localStorage.setItem("post_draft", JSON.stringify({
            //     type: this._postType,
            //     title: post.title,
            //     tags: post.tags.reduce((result, tag) => result ? `${result},${tag.content}` : tag.content, ""),
            //     content: post.content,
            //     coverImage: post.cover_image.original_image_url,
            //     previewImage: this.state.previewImage,
            // }));
            this._populatePost();
        } else if (postDraft) { // Draft Flow
            this.setState({ ...postDraft });
        } else { // Fresh Flow
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
        const [ styles, occasions ] = await Promise.all([
            this.context.api.getPostTags(PostTagType.STYLE),
            this.context.api.getPostTags(PostTagType.OCCASION),
        ]);
        this.setState({ styles, occasions });
    }

    render() {
        return (
            <div className="post-upload">
                <div className="post-upload-header">
                    {this._postId && (
                        <Button className="delete-button" variant={ButtonVariant.BLANK} onClick={this._delete}>Delete</Button>
                    )}
                    <Button variant={ButtonVariant.OUTLINE} onClick={this._cancel}>Cancel</Button>
                    <Button onClick={this._submit}>{this._postId ? "Update Post" : "Create Post"}</Button>
                </div>
                {this._hasFieldType(PostFieldType.TITLE) && (
                    <div className="form-field">
                        <label htmlFor="post-upload-title">Title*</label>
                        <Input
                            id="post-upload-title"
                            value={this.state.title}
                            placeholder="Title"
                            onChange={this._onTitleChange}
                            error={this.state.errors && this.state.errors["title"]}
                        />
                    </div>
                )}
                {this._hasFieldType(PostFieldType.CAPTION) && (
                    <div className="form-field">
                        <label htmlFor="post-upload-caption">Caption*</label>
                        <Input
                            id="post-upload-caption"
                            value={this.state.caption}
                            placeholder="Caption"
                            onChange={this._onCaptionChange}
                            error={this.state.errors && this.state.errors["caption"]}
                        />
                    </div>
                )}
                {this._hasFieldType(PostFieldType.CTA_URL) && (
                    <div className="form-field">
                        <label htmlFor="post-upload-cta">CTA url*</label>
                        <Input
                            id="post-upload-cta"
                            value={this.state.ctaUrl}
                            placeholder="CTA Url"
                            onChange={this._onCtaUrlChange}
                            error={this.state.errors && this.state.errors["cta_url"]}
                        />
                    </div>
                )}
                {this._hasFieldType(PostFieldType.COVER_IMAGE) && (
                    <div className="form-field">
                        <label htmlFor="post-upload-cover">Cover Image*</label>
                        <Button onClick={this._openModal}>Add Cover Image</Button>
                        <div className="form-error">{this.state.errors && this.state.errors["cover_image_url"]}</div>
                        {this.state.coverImage}
                    </div>
                )}
                <div className="style-occasion-tag">
                    {this._hasFieldType(PostFieldType.STYLES) && (
                        <div className="form-field">
                            <label htmlFor="post-upload-styles">Styles</label>
                            <div className="post-upload-select" id="post-upload-styles">
                                {this.state.styles.map(style => (
                                    <Checkbox
                                        value={style.id}
                                        label={style.content}
                                        onChange={() => this._onStyleTagChange(style)}
                                        checked={this.state.selectedStyles.some(s => s.id === style.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {this._hasFieldType(PostFieldType.OCCASIONS) && (
                        <div className="form-field">
                            <label htmlFor="post-upload-occasions">Occasions</label>
                            <div className="post-upload-select" id="post-upload-occasions">
                                {this.state.occasions.map(occasion => (
                                    <Checkbox
                                        value={occasion.id}
                                        label={occasion.content}
                                        onChange={() => this._onOccasionTagChange(occasion)}
                                        checked={this.state.selectedOccasions.some(s => s.id === occasion.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {this._hasFieldType(PostFieldType.TAGS) && (
                    <div className="form-field">
                        <label htmlFor="post-upload-tags">Tags</label>
                        <Input
                            id="post-upload-tags"
                            value={this.state.tags}
                            placeholder="Tags"
                            onChange={this._onTagsChange}
                        />
                    </div>
                )}
                {this._hasFieldType(PostFieldType.PRODUCT_TAGS) && (
                    <div className="form-field">
                        <label htmlFor="post-upload-product-tags">Products In this Post</label>
                        <ProductSearchModal
                            selectedProducts={this.state.productTags}
                            selectProduct={this._selectProduct}
                            removeProduct={this._removeProduct}
                        />
                        <div className="form-error">{this.state.errors && this.state.errors["product_tags"]}</div>
                    </div>
                )}
                {this._hasFieldType(PostFieldType.CONTENT) && (
                    <div className="form-field">
                        <label htmlFor="post-upload-content">Content*</label>
                        <div className="form-error">{this.state.errors && this.state.errors["content"]}</div>
                        <PostEditor
                            editorState={this.state.content}
                            onChange={this._onContentChange}
                            getPresignedPost={this._getPresignedPost}
                        />
                    </div>
                )}
                <ImageUploadModal
                    modalOpen={this.state.modalOpen}
                    setImage={this._setCoverImage}
                    close={this._closeModal}
                />
            </div>
        );
    }

    private _postType: PostType;
    private _postId: string;
    private _postFields: Array<PostField>;

    private _populatePost = async () => {
        let post;
        let productTags;
        switch (this._postType) {
            case PostType.ARTICLE:
            case PostType.COLLECTION:
                post = await this.context.api.getFeaturedPost(this._postId);
                break;
            case PostType.BLOG:
                post = await this.context.api.getPost(this._postId);
                productTags = post.product_tags.map(tag => {
                    const product = post.products.find(product => product.id === tag.product_id);
                    if (product) {
                        return {
                            id: product.id,
                            brand: product.brand && product.brand.name,
                            merchant: product.merchant && product.merchant.name,
                            category: product.category && product.category.display_name,
                            title: product.title,
                            price: product.price,
                            image: product.image && product.image.original_image_url,
                            url: product.url,
                        } as ProductSearchTag;
                    }
                });
                break;
        }
        const draft = {
            type: this._postType,
            title: post.title,
            caption: post.caption || "",
            ctaUrl: post.cta_url || "",
            content: post.content,
            coverImage: post.cover_image && post.cover_image.original_image_url,
            selectedStyles: post.style_tags || [],
            selectedOccasions: post.occasion_tags || [],
            tags: post.tags.reduce((result, tag) => result ? `${result},${tag.content}` : tag.content, ""),
            productTags: productTags || [],
        };

        this.setState(draft);
        localStorage.setItem("post_draft", JSON.stringify(draft));
    }

    private _submit = async () => {
        const productTags = this.state.productTags.map(product => ({
            product_id: product.id,
            api_type: "shopstyle",
            x_axis: 0,
            y_axis: 0,
        } as TagRequest));

        let request;
        switch (this._postType) {
            case PostType.ARTICLE:
                request = {
                    type: this._postType.toUpperCase(),
                    title: this.state.title,
                    caption: this.state.caption,
                    content: this.state.content,
                    tag_list: this.state.tags.split(",").map(tag => tag.trim()),
                    style_tag_list: this.state.selectedStyles.map(style => style.content),
                    occasion_tag_list: this.state.selectedOccasions.map(occasion => occasion.content),
                    cover_image_url: this.state.coverImage,
                    cta_url: this.state.ctaUrl,
                    priority_level: 0,
                } as ArticleRequest;
                break;
            case PostType.BLOG:
                request = {
                    title: this.state.title,
                    content: this.state.content,
                    tag_list: this.state.tags.split(",").map(tag => tag.trim()),
                    cover_image_url: this.state.coverImage,
                    style_tag_list: this.state.selectedStyles.map(style => style.content),
                    occasion_tag_list: this.state.selectedOccasions.map(occasion => occasion.content),
                    product_tags: productTags,
                } as PostRequest;
                break;
            case PostType.COLLECTION:
                request = {
                    type: this._postType.toUpperCase(),
                    title: this.state.title,
                    caption: this.state.caption,
                    content: "content",
                    tag_list: this.state.tags.split(",").map(tag => tag.trim()),
                    style_tag_list: this.state.selectedStyles.map(style => style.content),
                    occasion_tag_list: this.state.selectedOccasions.map(occasion => occasion.content),
                    cover_image_url: this.state.coverImage,
                    direct_url: this.state.ctaUrl,
                    priority_level: 0,
                } as ResultRequest;
                break;
        }
        let response;
        if (this._postId) {
            response = await this.context.api.updatePost(this._postType, this._postId, request);
        } else {
            response = await this.context.api.createPost(this._postType, request);
        }

        if (response.code !== 1) {
            localStorage.removeItem("post_draft");
            this.props.history.push("/cms");
        } else {
            this.setState({ errors: response.result });
        }
    }

    private _delete = () => {
        this.context.api.deletePost(this._postId, this._postType);
        localStorage.removeItem("post_draft");
        this.props.history.push("/cms");
    }

    private _cancel = () => {
        localStorage.removeItem("post_draft");
        this.props.history.push("/cms");
    }

    private _hasFieldType = (postFieldType: PostFieldType) => {
        return this._postFields.some(postField => postField.type === postFieldType);
    }

    private _removeProduct = (product: ProductSearchResult) => {
        let productTags = this.state.productTags;
        productTags = productTags.filter(tag => tag.id !== product.id);
        this.setState({ productTags });
    }

    private _selectProduct = (product: ProductSearchResult) => {
        const formattedProduct = {
            id: product.id,
            brand: product.brand,
            merchant: product.merchant,
            category: product.category,
            title: product.title,
            image: product.image,
            url: product.url,
        } as ProductSearchTag;
        let productTags = this.state.productTags;
        productTags.push(formattedProduct);
        this.setState({ productTags });
        this._updateDraft({ productTags });
    }

    private _onOccasionTagChange = (searchCheckbox: any) => {
        let selectedOccasions = this.state.selectedOccasions;
        if (selectedOccasions.some(value => value.id === searchCheckbox.id)) {
            selectedOccasions = selectedOccasions.filter(value => value.id !== searchCheckbox.id);
        } else {
            selectedOccasions.push(searchCheckbox);
        }

        this.setState({ selectedOccasions });
        this._updateDraft({ selectedOccasions });
    }

    private _onStyleTagChange = (searchCheckbox: any) => {
        let selectedStyles = this.state.selectedStyles;
        if (selectedStyles.some(value => value.id === searchCheckbox.id)) {
            selectedStyles = selectedStyles.filter(value => value.id !== searchCheckbox.id);
        } else {
            selectedStyles.push(searchCheckbox);
        }

        this.setState({ selectedStyles });
        this._updateDraft({ selectedStyles });
    }

    private _onContentChange = (content: string) => {
        this.setState({ content });
        this._updateDraft({ content });
        this._removeError("content");
    }

    private _onTitleChange = (title: string) => {
        this.setState({ title });
        this._updateDraft({ title });
        this._removeError("title");
    }

    private _onTagsChange = (tags: string) => {
        this.setState({ tags });
        this._updateDraft({ tags });
        this._removeError("tags");
    }

    private _onCaptionChange = (caption: string) => {
        this.setState({ caption });
        this._updateDraft({ caption });
        this._removeError("caption");
    }

    private _onCtaUrlChange = (ctaUrl: string) => {
        this.setState({ ctaUrl });
        this._updateDraft({ ctaUrl });
        this._removeError("cta_url");
    }

    private _closeModal = () => {
        this.setState({ modalOpen: false });
    }

    private _openModal = () => {
        this.setState({ modalOpen: true });
    }

    private _setCoverImage = (coverImage: string, altText: string) => {
        this.setState({ coverImage });
        this._updateDraft({ coverImage });
        this._removeError("cover_image_url");
    }

    private _getPresignedPost = (request: PresignedPostRequest) => {
        return this.context.api.getPresignedPost(request);
    }

    private _removeError = (errorKey: string) => {
        let errors = this.state.errors;
        if (errors[errorKey]) {
            delete errors[errorKey];
            this.setState({ errors });
        }
    }

    private _updateDraft = (draftData: Partial<PostDraft>) => {
        let draft = JSON.parse(localStorage.getItem("post_draft")) as PostDraft;
        if (!draft) {
            draft = {} as PostDraft;
        }

        if (draftData.content) {
            draft.content = draftData.content;
        }
        if (draftData.coverImage) {
            draft.coverImage = draftData.coverImage;
        }
        if (draftData.previewImage) {
            draft.previewImage = draftData.previewImage;
        }
        if (draftData.productTags) {
            draft.productTags = draftData.productTags;
        }
        if (draftData.selectedOccasions) {
            draft.selectedOccasions = draftData.selectedOccasions;
        }
        if (draftData.selectedStyles) {
            draft.selectedStyles = draftData.selectedStyles;
        }
        if (draftData.tags) {
            draft.tags = draftData.tags;
        }
        if (draftData.title) {
            draft.title = draftData.title;
        }
        if (draftData.type) {
            draft.type = draftData.type;
        }
        if (draftData.caption) {
            draft.caption = draftData.caption;
        }
        if (draftData.ctaUrl) {
            draft.ctaUrl = draftData.ctaUrl;
        }
        localStorage.setItem("post_draft", JSON.stringify(draft));
    }
}

PostUpload.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
