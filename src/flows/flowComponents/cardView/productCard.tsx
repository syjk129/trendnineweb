import * as React from "react";

import Wishlist, { WishlistType } from "../../../components/anchor/wishlist";
import Card from "../../../components/card";

import "./style.scss";

interface ProductCardProps {
    product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
    const footerItem = (
        <div>
            <p>{product.brand.name}</p>
            <div className="product-action-btns">
                <p>${product.price}</p>
                <Wishlist
                    id={product.id}
                    type={WishlistType.PRODUCT}
                    wishlisted={product.wishlisted}
                    onClick={() => this.props.toggleWishlist(product.id, "product")}
                />
            </div>
        </div>
    );

    return (
        <Card
            scaleImage
            imageUrl={product.image.small_image_url}
            redirectUrl={product.id}
            title={product.title}
            footerItem={footerItem}
        />
    );
}
