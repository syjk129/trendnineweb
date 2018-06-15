import * as React from "react";

import Button, { ButtonVariant } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import Image from "../../components/image";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import { ContentSection, ExpandableSection } from "../flowComponents/section";
import { ProductProps } from "./types";

export default function MobileProduct({
    product,
    relatedProducts,
    reviews,
    wishlisted,
    toggleWishlist,
}: ProductProps) {
    let wishlistBtnText = wishlisted ? "Remove from wishlist" : "Add to wishlist";

    return (
        <div className="mobile-product">
            <Carousel slidesToShow={1}>
                {product.alt_images.map(image => <div><CarouselItem imageUrl={image.url} /></div>)}
            </Carousel>
            <div className="product-details">
                <p className="product-brand">{product.brand.name}</p>
                <p className="product-name">{product.title}</p>
                <p className="product-seller">Sold by {product.merchant.name}</p>
                <p className="product-price">${product.price}</p>
                <Button variant={ButtonVariant.PRIMARY} onClick={() => location = product.url}>Buy Now</Button>
                <Button variant={ButtonVariant.OUTLINE} onClick={toggleWishlist}>{wishlistBtnText}</Button>
            </div>
            <ExpandableSection title="Product Details">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </ExpandableSection>
            <ExpandableSection title="Size & Fit" />
            <ExpandableSection title="Shipping & Returns" />
            <ContentSection title="How Our Influencers wear this Product">
                <Carousel>
                    {relatedProducts.map(content => (
                        <div>
                            <CarouselItem
                                imageUrl={content.image && content.image.small_image_url}
                                redirectUrl={`/product/${content.id}`}
                                title={content.brand.name}
                                detail={content.title}
                                subdetail={
                                    <div>
                                        <ActionLinks
                                            variant={ActionLinksVariant.PRODUCT}
                                            id={product.id}
                                            wishlisted={product.wishlisted}
                                        />
                                    </div>
                                }
                            />
                        </div>
                    ))}
                </Carousel>
            </ContentSection>
        </div>
    );
}
