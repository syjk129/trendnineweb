import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match } from "react-router-dom";

import { Post } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import Button, { ButtonVariant } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Image, { ImageFitVariant } from "../../components/image";
import Sidebar from "../../components/sidebar";
import Sticky from "../../components/sticky";
import ActionLinks, {ActionLinksVariant} from "../flowComponents/actions";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import { ContentSection, SidebarPostProductListSection, SidebarSection } from "../flowComponents/section";
import SidebarGrid from "../flowComponents/sidebarGrid";
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

    render() {
        const {
            product,
            relatedProducts,
            reviews,
            wishlisted,
            toggleWishlist,
        } = this.props;

        const reviewsTitle = reviews && reviews.length > 0 ? (
            `Reviews (${reviews.length})`
        )  : "Reviews";

        const productSizes = new Set<string>();
        const images = [];
        if (product) {
            product.alt_images.forEach(image => {
                images.push(image.url);
            });
            images.push(product.image.original_image_url);
        }

        if (product && product.productItems) {
            product.productItems.forEach(productItem => productSizes.add(productItem.size));
        }

        const carouselSettings = {
            vertical: true,
            focusOnSelect: true,
            verticalSwiping: true,
            arrows: false,
        };

        let wishlistBtnText = wishlisted ? "Remove from wishlist" : "Add to wishlist";
        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed"));

        return (
            <div className="product">
                    <Sidebar>
                        {recentlyViewed &&
                            <Sticky id="recently-viewed-section" stickyClassName="sticky-sidebar-recently-viewed">
                                <SidebarPostProductListSection title="Recently Viewed" items={recentlyViewed} />
                            </Sticky>
                        }
                    </Sidebar>
                <Content>
                    {product && (
                        <div className="product-view">
                            <div className="product-images">
                                <div className="product-main-image">
                                    {images.map(image => (
                                        <Image src={image} fit={ImageFitVariant.SCALED} square/>
                                    ))}
                                </div>
                            </div>
                            <div className="product-details">
                                <p className="product-brand">{product.brand.name}</p>
                                <p className="product-name">{product.title}</p>
                                <p className="product-seller">Sold by {product.merchant.name}</p>
                                <p className="product-price">${product.price}</p>
                                <div className="divider" />
                                <p className="product-information">
                                    <div className="product-information-title">
                                        Product Details
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                </p>
                                <div className="button-container">
                                    <Button rounded variant={ButtonVariant.PRIMARY} onClick={() => window.open(product.url)}>Buy Now</Button>
                                    <Button rounded variant={ButtonVariant.OUTLINE} onClick={toggleWishlist}>{wishlistBtnText}</Button>
                                </div>
                            </div>
                        </div>
                    )}
                    {relatedProducts && (
                        <ContentSection title="You may also like">
                            <Carousel slidesToShow={relatedProducts.length >= 5 ? 5 : relatedProducts.length}>
                                {relatedProducts.map(product => (
                                    <div>
                                        <CarouselItem
                                            fit={ImageFitVariant.SCALED}
                                            imageUrl={product.image && product.image.small_image_url}
                                            redirectUrl={`/product/${product.id}`}
                                            title={product.brand && product.brand.name}
                                            detail={product.title}
                                            subdetail={this._renderProductFooter(product)}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </ContentSection>
                    )}
                </Content>
            </div>
        );
    }

    private _productId: string;

    @autobind
    private _renderProductFooter(product) {
        return (
        <div className="post-card-hover-footer">
            <p className="post-card-hover-price">
                {`$${product.price}`}
            </p>
            <ActionLinks
                variant={ActionLinksVariant.PRODUCT}
                id={product.id}
                wishlisted={product.wishlisted}
            />
        </div>);
    }
}
