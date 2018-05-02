import autobind from "autobind-decorator";
import * as React from "react";

import { LinkButton } from "../../../components/button";
import Card from "../../../components/card";
import { IconVariant } from "../../../components/icon";

import "./style.scss";

interface ProductCardProps {
    product: any;
    toggleWishlist(postId: string, type: string): Promise<void>;
}

interface ProductCardState {
    wishlisted: boolean;
}

export default class ProductCard extends React.Component<ProductCardProps, ProductCardState> {
    state: ProductCardState = {
        wishlisted: this.props.product.wishlisted,
    };

    render() {
        const { product } = this.props;

        const footerItem = (
            <div>
                <p>{product.brand.name}</p>
                <div className="product-action-btns">
                    <p>${product.price}</p>
                    <LinkButton
                        icon={IconVariant.WISHLIST}
                        selected={this.state.wishlisted}
                        onClick={this._toggleWishlist}
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

    @autobind
    private _toggleWishlist() {
        this.props.toggleWishlist(this.props.product.id, "product");
        this.setState({ wishlisted: !this.state.wishlisted });
    }
}
