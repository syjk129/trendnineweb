import * as React from "react";

import Button, { ButtonVariant } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import { IconSize } from "../../components/icon";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import { ContentSection, ExpandableSection } from "../flowComponents/section";
import { ProductProps } from "./types";

import "./style.scss";

export default function MobileProduct({
    product,
    postsForProduct,
    wishlisted,
    toggleWishlist,
}: ProductProps) {
    let wishlistBtnText = wishlisted ? "Remove from wishlist" : "Add to wishlist";
    const attributes = {
        slidesToScroll: 1,
    };

    return (
        <div className="mobile-product">
            <Carousel attributes={attributes} slidesToShow={1}>
                {product.alt_images.map(image => <div><CarouselItem imageUrl={image.url} /></div>)}
            </Carousel>
            <div className="product-details">
                <p className="product-brand">{product.brand && product.brand.name}</p>
                <p className="product-name">{product.title}</p>
                <p className="product-seller">Sold by {product.merchant.name}</p>
                <p className="product-price">${product.price}</p>
                <Button rounded variant={ButtonVariant.PRIMARY} onClick={() => window.open(product.url)}>Buy Now</Button>
                <Button rounded variant={ButtonVariant.OUTLINE} onClick={toggleWishlist}>{wishlistBtnText}</Button>
            </div>
            <ExpandableSection expanded title="Product Details">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </ExpandableSection>
            {/* <ExpandableSection title="Size & Fit" />
            <ExpandableSection title="Shipping & Returns" /> */}
            <ContentSection title="How Influencers Wear It">
                <Carousel>
                    {postsForProduct.map(post => (
                        <div>
                            <CarouselItem
                                imageUrl={post.cover_image && post.cover_image.thumbnail_image_url}
                                redirectUrl={`/post/${post.id}`}
                                title={post.author && post.author.username}
                                detail={post.title}
                                subdetail={(
                                    <>
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
                                )}
                            />
                        </div>
                    ))}
                </Carousel>
            </ContentSection>
        </div>
    );
}
