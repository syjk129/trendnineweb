export interface ProductProps {
    product: any;
    relatedProducts: Array<any>;
    reviews: Array<any>;
    wishlisted: boolean;
    toggleWishlist(): void;
}

