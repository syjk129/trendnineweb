import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match } from "react-router-dom";

import { Post } from "../../api/models";
import { AppContext } from "../../app";
import Button, { ButtonVariant } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Image from "../../components/image";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import { ContentSection, SidebarSection } from "../flowComponents/section";
import SidebarGrid from "../flowComponents/sidebarGrid";

import "./style.scss";

interface ProductProps {
    match: match<any>;
}

interface ProductState {
    currentProduct: any;
    relatedProducts: Array<any>;
    reviews: Array<any>;
    selectedImage: string;
}

export default class ProductView extends React.Component<ProductProps, ProductState> {
    static contextTypes: AppContext;

    state: ProductState = {
        currentProduct: null,
        relatedProducts: [],
        reviews: [],
        selectedImage: null,
    };

    async componentWillMount() {
        this._productId = this.props.match.params.productId;

        try {
            const [
                currentProduct,
                relatedProducts,
                reviews,
            ] = await Promise.all([
                this.context.api.getProduct(this._productId),
                this.context.api.getRelatedProducts(),
                this.context.api.getReviews(this._productId),
            ]);

            this.setState({
                currentProduct,
                relatedProducts,
                selectedImage: currentProduct.image.original_image_url,
                reviews,
            });
        } catch (err) {
            console.warn(err);
        }
    }

    render() {
        const reviewsTitle = this.state.reviews && this.state.reviews.length > 0 ? (
            `Reviews (${this.state.reviews.length})`
        )  : "Reviews";

        const productSizes = new Set<string>();
        const images = [];
        if (this.state.currentProduct) {
            this.state.currentProduct.alt_images.forEach(image => {
                images.push(image.url);
            });
            images.push(this.state.currentProduct.image.small_image_url);
        }
        // const images = this.state.currentProduct.alt_images.map(image => image.id).concat();

        if (this.state.currentProduct && this.state.currentProduct.productItems) {
            this.state.currentProduct.productItems.forEach(productItem => productSizes.add(productItem.size));
        }

        // const currentImage = this.state.currentProduct.alt_images.find(image => image.id === this.state.selectedImage);

        const carouselSettings = {
            vertical: true,
        };

        return (
            <div className="product">
                {this.state.currentProduct && (
                    <div className="product-view">
                        <div className="product-images">
                            <Carousel slidesToShow={5} attributes={carouselSettings}>
                                {images.map(image => (
                                    <div>
                                        <CarouselItem
                                            imageUrl={image}
                                            selected={this.state.selectedImage === image}
                                            onClick={() => this._selectImage(image)}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                            <div className="product-main-image">
                                <Image src={this.state.selectedImage} square/>
                            </div>
                        </div>
                        <div className="product-details">
                            <p className="product-brand">{this.state.currentProduct.brand.name}</p>
                            <p className="product-name">{this.state.currentProduct.title}</p>
                            <p className="product-seller">Sold by {this.state.currentProduct.merchant.name}</p>
                            <p className="product-price">${this.state.currentProduct.price}</p>
                            <p className="product-color">Color</p>
                            <select>
                                {this.state.currentProduct.colors.map(color => (
                                    <option value={color.id}>{color.name}</option>
                                ))}
                            </select>
                            <p>Size</p>
                            {Array.from(productSizes).map(size => (
                                <Button variant={ButtonVariant.OUTLINE} inline>{size}</Button>
                            ))}
                            <p>Quantity</p>
                            <div className="button-container">
                                <Button variant={ButtonVariant.PRIMARY}>Add to bag</Button>
                                <Button variant={ButtonVariant.OUTLINE} onClick={this._toggleWishlist}>Add to wishlist</Button>
                            </div>
                        </div>
                    </div>
                )}
                {this.state.relatedProducts && (
                    <ContentSection title="You may also like">
                        <Carousel slidesToShow={this.state.relatedProducts.length >= 5 ? 5 : this.state.relatedProducts.length}>
                            {this.state.relatedProducts.map(product => (
                                <div>
                                    <CarouselItem
                                        imageUrl={product.image.small_image_url}
                                        title={product.brand.name}
                                        detail={product.title}
                                        subdetail={`$${product.price}`}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </ContentSection>
                )}
                <ContentSection title={reviewsTitle}>
                    <Comments
                        placeholder="Write a review"
                        comments={this.state.reviews}
                        submitComment={this._submitReview}
                    />
                </ContentSection>
            </div>
        );
    }

    private _productId: string;

    @autobind
    private _selectImage(imageId: string) {
        this.setState({ selectedImage: imageId });
    }

    @autobind
    private _submitReview(comment: string, parentCommentId: string) {
        return this.context.api.submitReview(this._productId, comment, parentCommentId);
    }

    @autobind
    private _toggleWishlist() {
        this.context.api.toggleWishlist(this._productId, "product");
    }
}

ProductView.contextTypes = {
    api: PropTypes.any,
};
