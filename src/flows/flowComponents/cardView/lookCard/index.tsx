import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link, withRouter } from "react-router-dom";
import Slider from "react-slick";

import { PostPreview, Product } from "../../../../api/models";
import { AppContext } from "../../../../app";
import { IconButton } from "../../../../components/button";
import { IconVariant } from "../../../../components/icon";
import Image, { ImageFitVariant, ImageRatioVariant } from "../../../../components/image";
import RouteProps from "../../../routeProps";

import "./style.scss";

interface LookCardProps extends RouteProps {
    look: PostPreview;
    className?: string;
    clearData?(): void;
    onload?(): void;
}

interface LookCardState {
    showDetails: boolean;
    focusedProduct: Product;
    wishlisted: boolean;
    wishlistedProducts: Set<string>;
}

class LookCard extends React.Component<LookCardProps, LookCardState> {
    static contextTypes: AppContext;

    state: LookCardState = {
        showDetails: false,
        focusedProduct: this.props.look.products ? this.props.look.products[0] : null,
        wishlisted: this.props.look.wishlisted,
        wishlistedProducts: new Set(),
    };

    render() {
        const { look, className, onload } = this.props;

        let classes = "look-card";

        if (className) {
            classes += ` ${className}`;
        }

        if (isMobile) {
            classes += " mobile";
        }

        const imageUrl = look.cover_image && (isMobile ? look.cover_image.small_image_url : look.cover_image.thumbnail_image_url);

        return (
            <div className={`look-card-container${isMobile ? " mobile" : ""}`}>
                <div
                    className={classes}
                    onMouseEnter={!isMobile && this._onCardMouseEnter}
                    onMouseLeave={!isMobile && this._onCardMouseLeave}
                >
                    <Link
                        to={{
                            pathname: `/post/${look.id}`,
                            state: {
                                modal: !isMobile,
                                clearData: this.props.clearData,
                            },
                        }}
                    >
                        <Image
                            className="look-image"
                            src={imageUrl}
                            fit={ImageFitVariant.COVER}
                            ratio={ImageRatioVariant.LOOK_COVER}
                            onload={onload}
                        />
                    </Link>
                    <div className="look-card-details">
                        <Link className="look-card-author" to={`/user/${look.author.username}`}>
                            <Image
                                className="look-card-author-image"
                                fit={ImageFitVariant.COVER}
                                src={look.author.profile_small_image_url}
                                circle
                            />
                            {look.author.username}
                        </Link>
                        {this.state.showDetails && (
                            <div className="look-card-products-container">
                                {this._renderProductCarousel()}
                                {this.state.focusedProduct && (
                                    <div className="look-product-details">
                                        <p className="product-brand">{this.state.focusedProduct.brand && this.state.focusedProduct.brand.name || this.state.focusedProduct.title}</p>
                                        <div className="price-wishlist">
                                            <p className="product-price">${Math.ceil(this.state.focusedProduct.price)}</p>
                                            <IconButton
                                                inline
                                                icon={IconVariant.WISHLIST}
                                                selected={this.state.focusedProduct.wishlisted || this.state.wishlistedProducts.has(this.state.focusedProduct.id)}
                                                onClick={this._toggleProductWishlist}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="wishlist">
                        <IconButton
                            icon={IconVariant.WISHLIST}
                            selected={this.state.wishlisted}
                            onClick={this._toggleWishlist}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private _toggleWishlist = () => {
        if (this.state.wishlisted) {
            this.context.api.unwishlist(this.props.look.id, "blog");
        } else {
            this.context.api.wishlist(this.props.look.id, "blog");
        }
        this.setState({ wishlisted: !this.state.wishlisted });
    }

    private _toggleProductWishlist = () => {
        const wishlistedProducts = this.state.wishlistedProducts;
        const product = this.state.focusedProduct;
        if (wishlistedProducts.has(product.id)) {
            wishlistedProducts.delete(product.id);
            this.context.api.unwishlistProduct(product.id);
        } else {
            wishlistedProducts.add(product.id);
            this.context.api.wishlistProduct(product.id);
        }
        this.setState({ wishlistedProducts });
    }

    private _renderProductCarousel = () => {
        const carouselSettings = {
            variableWidth: false,
            dots: false,
            prevArrow: <IconButton icon={IconVariant.ARROW_LEFT} />,
            nextArrow: <IconButton icon={IconVariant.ARROW_RIGHT} />,
            slidesToShow: 4,
        };

        if (this.props.look.products.length < 4) {
            return (
                <div className="look-card-products">
                    {this.props.look.products.map(product => (
                        <Image
                            onMouseEnter={() => this._onProductMouseEnter(product)}
                            fit={ImageFitVariant.COVER}
                            className={`product-image${this.state.focusedProduct.id === product.id ? " selected" : ""}`}
                            src={product.image && product.image.thumbnail_image_url}
                            onClick={this._redirectProduct(product)}
                        />
                    ))}
                </div>
            );
        }

        return (
            <div className="look-card-products-carousel">
                <Slider {...carouselSettings}>
                    {this.props.look.products.map(product => (
                        <div>
                            <div
                                className={`product-image-container${this.state.focusedProduct.id === product.id ? " selected" : ""}`}
                                onMouseEnter={() => this._onProductMouseEnter(product)}
                                onClick={this._redirectProduct(product)}
                            >
                                <Image
                                    className="product-image"
                                    square
                                    ratio={ImageRatioVariant.PRODUCT_IMAGE}
                                    fit={ImageFitVariant.COVER}
                                    src={product.image && product.image.thumbnail_image_url}
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }

    private _redirectProduct = (product) => {
        return () => {
            this.props.history.push(`/product/${product.id}?referrer_type=post&referrer_id=${this.props.look.id}`);
        };
    }

    private _onCardMouseEnter = () => {
        this.setState({ showDetails: true });
    }

    private _onCardMouseLeave = () => {
        this.setState({ showDetails: false });
    }

    private _onProductMouseEnter = (product: Product) => {
        this.setState({ focusedProduct: product });
    }
}

LookCard.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export default withRouter(LookCard);
