import autobind from "autobind-decorator";
import * as React from "react";

import { PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import Button, { ButtonVariant, IconButton } from "../../components/button";
import Callout, { CalloutVariant } from "../../components/callout";
import { CardContainer } from "../../components/card";
import Content from "../../components/content";
import { IconSize, IconVariant } from "../../components/icon";
import Image, { ImageFitVariant } from "../../components/image";
import Sticky from "../../components/sticky";
import formatTime from "../../util/formatTime";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import Author from "../flowComponents/author";
import ShopCard from "../flowComponents/cardView/shopCard";
import { ProductProps } from "./types";

import "./style.scss";

interface ProductState {
    selectedImage: string;
}

export default class DesktopProduct extends React.Component<ProductProps, ProductState> {
    static contextTypes: AppContext;

    state: ProductState = {
        selectedImage: null,
    };

    componentWillMount() {
        this._relatedProductRef = React.createRef();
    }

    render() {
        const {
            product,
            relatedProducts,
            postsForProduct,
            reviews,
            wishlisted,
            toggleWishlist,
            onProductClick,
        } = this.props;

        const reviewsTitle = reviews && reviews.length > 0 ? (
            `Reviews (${reviews.length})`
        )  : "Reviews";

        const productSizes = new Set<string>();
        const images = [];
        if (product) {
            images.push(product.image.original_image_url);
            product.alt_images.forEach(image => {
                images.push(image.url);
            });
        }

        if (product && product.productItems) {
            product.productItems.forEach(productItem => productSizes.add(productItem.size));
        }

        return (
            <div className="product-view-container">
                <div className="product">
                    <Content>
                        <div className="product-content">
                            {images.map(image => (
                                <img src={image} />
                            ))}
                        </div>
                    </Content>
                    <div className="product-sidebar">
                        {product && (
                            <Sticky
                                id="product-sidebar"
                                stickyClassName="sticky-product-sidebar"
                                bottomEl={this._relatedProductRef}
                                scrollRef={this.props.scrollRef}
                                maxTop={this.props.isModal ? 0 : null}
                            >
                                <div>
                                    <div className="product-brand">{product.brand && product.brand.name}</div>
                                    <h2 className="product-title">{product.title}</h2>
                                    <div className="product-price">${product.price}</div>
                                    <Button className="product-action" variant={ButtonVariant.PRIMARY} onClick={onProductClick}>Buy Now</Button>
                                    <Button className="product-action" variant={ButtonVariant.OUTLINE} onClick={toggleWishlist}>{wishlisted ? " Remove from Wishlist" : "Add to wishlist"}</Button>
                                    <div className="divider" />
                                    <Callout>Detail</Callout>
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            </Sticky>
                        )}
                    </div>
                </div>
                <div ref={this._relatedProductRef}>
                    <Callout>You Might Like</Callout>
                    <CardContainer>
                        {relatedProducts.map(product => (
                            <ShopCard product={product} clearData />
                        ))}
                    </CardContainer>
                </div>
            </div>
        );
    }

    private _relatedProductRef: React.RefObject<HTMLDivElement>;
}
