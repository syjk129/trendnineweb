import * as React from "react";

import Card from "../../../components/card";
import { IconVariant } from "../../../components/icon";
import ActionLinks, { ActionLinksVariant } from "../actions";

import "./style.scss";

interface ProductCardProps {
    product: any;
    gridSize?: number;
    isShop?: boolean;
}

interface ProductCardState {
    wishlisted: boolean;
}

export default class ProductCard extends React.Component<ProductCardProps, ProductCardState> {
    state: ProductCardState = {
        wishlisted: this.props.product.wishlisted,
    };

    render() {
        const { product, gridSize, isShop } = this.props;

        const wishlistVariant = this.state.wishlisted ? IconVariant.WISHLIST_FILLED : IconVariant.WISHLIST;
        const footerItem = (
            <div>
                <p>{product.brand && product.brand.name}</p>
                <div className="product-action-btns">
                    <p>${product.price}</p>
                    <ActionLinks
                        variant={ActionLinksVariant.PRODUCT}
                        id={product.id}
                        wishlisted={product.wishlisted}
                    />
                </div>
            </div>
        );

        return (
            <Card
                gridSize={gridSize || 1}
                scaleImage
                imageUrl={product.image && product.image.small_image_url}
                redirectUrl={isShop ? `/shop/product/${product.id}` : `/product/${product.id}`}
                title={product.title}
                footerItem={footerItem}
            />
        );
    }
}
