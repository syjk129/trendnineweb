import * as React from "react";
import { isMobile } from "react-device-detect";

import Card from "../../../components/card";
import { IconSize, IconVariant } from "../../../components/icon";
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
            <div className="product-card-footer">
                <p className="product-card-brand">{product.title}</p>
                <div className="product-card-bottom">
                    <p className="product-card-price">${product.price}</p>
                    <div className="product-action-btns">
                        <ActionLinks
                            iconSize={isMobile && gridSize !== 2 ? IconSize.LARGE : IconSize.MEDIUM}
                            variant={ActionLinksVariant.PRODUCT}
                            id={product.id}
                            wishlisted={product.wishlisted}
                        />
                    </div>
                </div>
            </div>
        );

        return (
            <Card
                className="product-card"
                gridSize={gridSize || 1}
                scaleImage
                imageUrl={product.image && product.image.thumbnail_image_url}
                redirectUrl={isShop ? `/shop/product/${product.id}` : `/product/${product.id}`}
                title={product.brand && product.brand.name || "Product"}
                footerItem={footerItem}
            />
        );
    }
}
