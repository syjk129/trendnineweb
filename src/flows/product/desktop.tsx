import autobind from "autobind-decorator";
import * as React from "react";

import { PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import Button, { ButtonVariant, IconButton } from "../../components/button";
import Callout, { CalloutVariant } from "../../components/callout";
import Content from "../../components/content";
import { IconSize, IconVariant } from "../../components/icon";
import Image, { ImageFitVariant } from "../../components/image";
import Sticky from "../../components/sticky";
import formatTime from "../../util/formatTime";
import ActionLinks, { ActionLinksVariant } from "../flowComponents/actions";
import Author from "../flowComponents/author";
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
                        <Sticky
                            id="product-sidebar"
                            stickyClassName="sticky-product-sidebar"
                            bottomEl={this._relatedProductRef}
                            scrollRef={this.props.scrollRef}
                            maxTop={this.props.isModal ? 0 : null}
                        >
                            <div className="product-brand">{product.brand && product.brand.name}</div>
                            <h2 className="product-title">{product.title}</h2>
                            <div className="product-price">${product.price}</div>
                            <Button className="product-buy" variant={ButtonVariant.PRIMARY}>Buy Now</Button>
                            <div className="divider" />
                            <Callout>Detail</Callout>
                            <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        </Sticky>
                    </div>
                </div>
                    {/* <Sidebar>
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
                                <p className="product-brand">{product.brand && product.brand.name}</p>
                                <p className="product-name">{product.title}</p>
                                <p className="product-seller">Sold by {product.merchant && product.merchant.name}</p>
                                <p className="product-price">${product.price}</p>
                                <div className="divider" />
                                <p className="product-information">
                                    <div className="product-information-title">
                                        Product Details
                                    </div>
                                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                </p>
                                <div className="button-container">
                                    <Button rounded variant={ButtonVariant.PRIMARY} onClick={this.props.onProductClick}>Buy Now</Button>
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
                                            imageUrl={post.cover_image && post.cover_image.thumbnail_image_url}
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
                                            fit={ImageFitVariant.SCALED}
                                            imageUrl={product.image && product.image.thumbnail_image_url}
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
                </Content> */}
            </div>
        );
    }

    private _relatedProductRef: React.RefObject<HTMLDivElement>;
}
