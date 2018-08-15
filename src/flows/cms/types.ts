export enum PostType {
    BLOG = "blog",
    ARTICLE = "article",
    EDIT = "edit",
}

export interface PostDraft {
    type: PostType;
    title: string;
    tags: string | null;
    content: string;
    coverImage: string | null;
    previewImage: string | null;
}

export enum PostFieldType {
    TITLE = "title",
    CAPTION = "caption",
    TAGS = "tags",
    STYLES = "styles",
    OCCASIONS = "occasions",
    CONTENT = "content",
    CTA_URL = "cta_url",
    COVER_IMAGE = "cover_image",
    PREVIEW_IMAGE = "preview_image",
}
