import { Comment, Person, Post, Product } from "../../api/models";

export interface MobilePostProps {
    likes: number;
    liked: boolean;
    wishlisted: boolean;
    post: Post;
    comments: Array<Comment>;
    relatedPosts: Array<Post>;
    featuredTrendnines: Array<Person>;
    likeComment(commentId: string): Promise<void>;
    unlikeComment(commentId: string): Promise<void>;
    submitComment(comment: string, parentCommentId: string): Promise<void>;
    toggleLike(): void;
    toggleWishlist(): void;
}

export enum TabbedSectionTypes {
    PRODUCTS_IN_THIS_POST = "Products in this post",
    YOU_MAY_ALSO_LIKE = "You may also like",
}

export interface MobilePostState {
    section: TabbedSectionTypes;
    tabbedContent: Array<any>;
}
