export enum PostType {
    BLOG = "blog",
    ARTICLE = "article",
    COLLECTION = "cta",
}

export interface PostDraft {
    type: PostType;
    title: string;
    caption: string;
    tags: string | null;
    content: string;
    coverImage: string | null;
    previewImage: string | null;
    productTags: Array<ProductSearchTag>;
    ctaUrl: string;
    selectedStyles: Array<any>;
    selectedOccasions: Array<any>;
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
    PRODUCT_TAGS = "product_tags",
    PRIORITY_LEVEL = "priority_level",
}

export interface ProductSearchTag {
    id: string;
    brand: string;
    merchant: string;
    category: string;
    title: string;
    price: number;
    image: string;
    url: string;
}
