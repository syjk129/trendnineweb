import * as React from "react";
import { isMobile } from "react-device-detect";

import Card from "../../../components/card";
import { IconSize, IconVariant } from "../../../components/icon";
import ActionLinks, { ActionLinksVariant } from "../actions";

import "./style.scss";

interface ProductCardProps {
    product: any;
    isMobile?: boolean;
    gridSize?: number;
    isShop?: boolean;
    onload?(): void;
}

interface ProductCardState {
    wishlisted: boolean;
}

export default class ProductCard extends React.Component<ProductCardProps, ProductCardState> {
    state: ProductCardState = {
        wishlisted: this.props.product.wishlisted,
    };

    render() {
        const { product, gridSize, isMobile, onload, isShop } = this.props;

        const wishlistVariant = this.state.wishlisted ? IconVariant.WISHLIST_FILLED : IconVariant.WISHLIST;
        const footerItem = (
            <div className="product-card-footer">
                <p className="product-card-brand">{product.title}</p>
                <div className="product-card-bottom">
                    <div className="product-card-price">${product.price}</div>
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
                onload={onload}
                scaleImage
                newWindowUrl={product.url}
                imageUrl={product.image && (isMobile ? product.image.small_image_url : product.image.thumbnail_image_url)}
                redirectUrl={isShop ? `/shop/product/${product.id}` : `/product/${product.id}`}
                title={product.brand && product.brand.name || "Product"}
                footerItem={footerItem}
            />
        );
    }
}
