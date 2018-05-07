import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { match } from "react-router-dom";

import { Post } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import Button, { ButtonVariant } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Image from "../../components/image";
import ActionLinks, {ActionLinksVariant} from "../flowComponents/actions";
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
    wishlisted: boolean;
}

export default class ProductView extends React.Component<ProductProps, ProductState> {
    static contextTypes: AppContext;

    state: ProductState = {
        currentProduct: null,
        relatedProducts: [],
        reviews: [],
        selectedImage: null,
        wishlisted: false,
    };

    componentWillMount() {
        this.refreshContent(this.props);
    }

    componentWillReceiveProps(props: ProductProps) {
        this.refreshContent(props);
    }

    async refreshContent(props: ProductProps) {
        this._productId = props.match.params.productId;

        const [
            currentProduct,
            relatedProducts,
            reviews,
        ] = await Promise.all([
            this.context.api.getProduct(this._productId),
            this.context.api.getRelatedProducts(),
            this.context.api.getReviews(this._productId),
        ]);

        const wishlisted = currentProduct.wishlisted;

        this.setState({
            currentProduct,
            relatedProducts,
            selectedImage: currentProduct.image.original_image_url,
            reviews,
            wishlisted,
        });
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
            images.push(this.state.currentProduct.image.original_image_url);
        }
        // const images = this.state.currentProduct.alt_images.map(image => image.id).concat();

        if (this.state.currentProduct && this.state.currentProduct.productItems) {
            this.state.currentProduct.productItems.forEach(productItem => productSizes.add(productItem.size));
        }

        // const currentImage = this.state.currentProduct.alt_images.find(image => image.id === this.state.selectedImage);

        const carouselSettings = {
            vertical: true,
            focusOnSelect: true,
            verticalSwiping: true,
            arrows: false,
        };

        let wishlistBtnText = this.state.wishlisted ? "Remove from wishlist" : "Add to wishlist";

        return (
            <div className="product">
                {this.state.currentProduct && (
                    <div className="product-view">
                        <div className="product-images">
                            <Carousel attributes={carouselSettings}>
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
                            {/* <p className="product-color">Color</p>
                            <select>
                                {this.state.currentProduct.colors.map(color => (
                                    <option value={color.id}>{color.name}</option>
                                ))}
                            </select> */}
                            <p className="product-information">
                                <div dangerouslySetInnerHTML={{ __html: this.state.currentProduct.description }} />
                            </p>
                            <div className="button-container">
                                <Button variant={ButtonVariant.PRIMARY} onClick={() => location = this.state.currentProduct.url}>Buy Now</Button>
                                <Button variant={ButtonVariant.OUTLINE} onClick={this._wishlistUnwishlistProduct}>{wishlistBtnText}</Button>
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
                                        redirectUrl={`/product/${product.id}`}
                                        title={product.brand.name}
                                        detail={product.title}
                                        subdetail={this._renderProductFooter(product)}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </ContentSection>
                )}
                {/* <ContentSection title={reviewsTitle}>
                    <Comments
                        placeholder="Write a review"
                        comments={this.state.reviews}
                        submitComment={this._submitReview}
                    />
                </ContentSection> */}
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
    private _wishlistUnwishlistProduct() {
        if (this.state.wishlisted) {
            this.context.api.unwishlistProduct(this._productId);
            this.setState({ wishlisted: false });
        } else {
            this.context.api.wishlistProduct(this._productId);
            this.setState({ wishlisted: true });
        }
    }

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

ProductView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
};
