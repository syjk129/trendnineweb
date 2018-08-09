import { PostPreview } from "../../api/models";

export interface ProductProps {
    product: any;
    relatedProducts: Array<any>;
    postsForProduct: Array<PostPreview>;
    reviews: Array<any>;
    wishlisted: boolean;
    toggleWishlist(): void;
    onProductClick(): void;
}

