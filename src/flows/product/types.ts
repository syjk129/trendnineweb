import { PostPreview } from "../../api/models";

export interface ProductProps {
    product: any;
    relatedProducts: Array<any>;
    postsForProduct: Array<PostPreview>;
    reviews: Array<any>;
    wishlisted: boolean;
    scrollRef?: React.RefObject<HTMLDivElement>;
    isModal?: boolean;
    toggleWishlist(): void;
    onProductClick(): void;
}

