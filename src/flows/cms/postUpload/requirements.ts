import { PostFieldType, PostType } from "../types";

export interface PostField {
    type: PostFieldType;
    required: boolean;
}

export default function getUploadRequirements(postType: PostType): Array<PostField> {
    switch (postType) {
        case PostType.ARTICLE:
            return [
                {
                    type: PostFieldType.TITLE,
                    required: true,
                },
                {
                    type: PostFieldType.CAPTION,
                    required: true,
                },
                {
                    type: PostFieldType.TAGS,
                    required: false,
                },
                {
                    type: PostFieldType.STYLES,
                    required: false,
                },
                {
                    type: PostFieldType.OCCASIONS,
                    required: false,
                },
                {
                    type: PostFieldType.CONTENT,
                    required: true,
                },
                {
                    type: PostFieldType.PREVIEW_IMAGE,
                    required: true,
                },
            ];
        case PostType.BLOG:
            return [
                {
                    type: PostFieldType.TITLE,
                    required: true,
                },
                {
                    type: PostFieldType.CAPTION,
                    required: true,
                },
                {
                    type: PostFieldType.TAGS,
                    required: false,
                },
                {
                    type: PostFieldType.STYLES,
                    required: false,
                },
                {
                    type: PostFieldType.OCCASIONS,
                    required: false,
                },
                {
                    type: PostFieldType.CONTENT,
                    required: true,
                },
                {
                    type: PostFieldType.COVER_IMAGE,
                    required: true,
                },
                {
                    type: PostFieldType.PREVIEW_IMAGE,
                    required: true,
                },
            ];
        case PostType.EDIT:
            return [
                {
                    type: PostFieldType.TITLE,
                    required: true,
                },
                {
                    type: PostFieldType.CAPTION,
                    required: true,
                },
                {
                    type: PostFieldType.TAGS,
                    required: false,
                },
                {
                    type: PostFieldType.STYLES,
                    required: false,
                },
                {
                    type: PostFieldType.OCCASIONS,
                    required: false,
                },
                {
                    type: PostFieldType.CTA_URL,
                    required: true,
                },
                {
                    type: PostFieldType.COVER_IMAGE,
                    required: false,
                },
            ];
        default:
            throw new Error("Unsupported post type");
    }
}
