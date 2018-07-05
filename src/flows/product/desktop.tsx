import autobind from "autobind-decorator";
import * as React from "react";

import { PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import Button, { ButtonVariant } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import { IconSize } from "../../components/icon";
import Image, { ImageFitVariant } from "../../components/image";
import Sidebar from "../../components/sidebar";
import Sticky from "../../components/sticky";
import formatTime from "../../util/formatTime";
import ActionLinks, {ActionLinksVariant} from "../flowComponents/actions";
import Author from "../flowComponents/author";
import { ContentSection, SidebarPostProductListSection } from "../flowComponents/section";
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
            postsForProduct,
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
                    {postsForProduct && postsForProduct.length > 0 && (
                        <ContentSection title="How Influencers Wear It">
                            <Carousel>
                                {postsForProduct.map(post => (
                                    <div>
                                        <CarouselItem
                                            fit={ImageFitVariant.SCALED}
                                            imageUrl={post.cover_image && post.cover_image.small_image_url}
                                            redirectUrl={`/post/${post.id}`}
                                            title={post.author && post.author.username}
                                            detail={post.title}
                                            subdetail={ this._renderPostFooter(post) }
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </ContentSection>
                    )}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <ContentSection title="You May Also Like">
                            <Carousel slidesToShow={relatedProducts.length >= 5 ? 5 : relatedProducts.length}>
                                {relatedProducts.map(product => (
                                    <div>
                                        <CarouselItem
                                            fit={ImageFitVariant.COVER}
                                            imageUrl={product.image && product.image.small_image_url}
                                            redirectUrl={`/post/${product.id}`}
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
                hideShare
            />
        </div>);
    }

    @autobind
    private _renderPostFooter(post: PostPreview) {
        return (
            <>
                <div className="author-date">
                    <Author author={post.author} />
                    {formatTime(post.created)}
                </div>
                <div className="post-card-footer">
                    <ActionLinks
                        iconSize={IconSize.MEDIUM}
                        variant={ActionLinksVariant.POST}
                        id={post.id}
                        wishlisted={post.wishlisted}
                        liked={post.liked}
                        likes={post.likes}
                    />
                </div>
            </>
        );
    }

}
