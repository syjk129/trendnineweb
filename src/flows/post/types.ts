import { Comment, Person, Post, Product } from "../../api/models";

export interface MobilePostProps {
    post: Post;
    comments: Array<Comment>;
    relatedPosts: Array<Post>;
    relatedProducts: Array<Product>;
    featuredTrendnines: Array<Person>;
    likeComment(commentId: string): Promise<void>;
    unlikeComment(commentId: string): Promise<void>;
    submitComment(comment: string, parentCommentId: string): Promise<void>;
}

export enum TabbedSectionTypes {
    PRODUCTS_IN_THIS_POST = "Products in this post",
    YOU_MAY_ALSO_LIKE = "You may also like",
}

export interface MobilePostState {
    section: TabbedSectionTypes;
    tabbedContent: Array<any>;
}
