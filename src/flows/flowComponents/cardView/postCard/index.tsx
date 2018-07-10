import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link, withRouter } from "react-router-dom";
import Slider from "react-slick";

import { PostPreview, Product } from "../../../../api/models";
import { AppContext } from "../../../../app";
import { IconButton } from "../../../../components/button";
import { IconSize, IconVariant } from "../../../../components/icon";
import Image, { ImageFitVariant } from "../../../../components/image";
import formatTime from "../../../../util/formatTime";
import RouteProps from "../../../routeProps";
import ActionLinks, {ActionLinksVariant} from "../../actions";
import Author from "../../author";

import "./style.scss";

interface PostCardProps extends RouteProps {
    post: PostPreview;
    gridSize?: number;
}

interface PostCardState {
    showDetails: boolean;
    focusedProduct: Product;
    wishlistedProducts: Set<string>;
}

class PostCard extends React.Component<PostCardProps, PostCardState> {
    static contextTypes: AppContext;

    state: PostCardState = {
        showDetails: false,
        focusedProduct: this.props.post.products[0],
        wishlistedProducts: new Set(),
    };

    render() {
        const { post, gridSize } = this.props;

        let classes = "post-card";
        if (gridSize) {
            classes += ` grid-size-${gridSize}`;
        }

        if (isMobile) {
            classes += " mobile";
        } else {
            classes += " desktop";
        }

        const imageUrl = post.cover_image && (isMobile ? post.cover_image.small_image_url : post.cover_image.thumbnail_image_url);

        return (
            <div className={classes} onMouseEnter={this._onCardMouseEnter} onMouseLeave={this._onCardMouseLeave}>
                <Link to={`/post/${post.id}`} className="post-card-image">
                    <Image
                        className="post-image"
                        src={imageUrl}
                        fit={ImageFitVariant.COVER}
                        square
                    />
                </Link>
                {this.state.showDetails && !isMobile && (
                    <div className="post-product">
                        {this._renderProductCarousel()}
                        {this.state.focusedProduct && (
                            <div className="post-product-details">
                                <p className="product-brand">{this.state.focusedProduct.brand && this.state.focusedProduct.brand.name || this.state.focusedProduct.title}</p>
                                <div className="product-price-wishlist">
                                    <p className="product-price">${Math.ceil(this.state.focusedProduct.price)}</p>
                                    <IconButton
                                        inline
                                        icon={IconVariant.WISHLIST}
                                        selected={this.state.focusedProduct.wishlisted || this.state.wishlistedProducts.has(this.state.focusedProduct.id)}
                                        onClick={() => this._toggleWishlist()}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {gridSize !== 3 && (
                    <div className="post-card-content">
                        <div className="title-container" onClick={() => this.props.history.push(`/post/${post.id}`)}>
                            <p className="title">{post.title}</p>
                        </div>
                        <div className="author-container">
                            <Author author={post.author} />
                            {gridSize !== 2 && formatTime(post.created)}
                        </div>
                        <ActionLinks
                            iconSize={isMobile && gridSize !== 2 ? IconSize.LARGE : IconSize.MEDIUM}
                            variant={ActionLinksVariant.POST}
                            id={post.id}
                            wishlisted={post.wishlisted}
                            liked={post.liked}
                            likes={post.likes}
                        />
                    </div>
                )}
            </div>
        );
    }

    private _renderProductCarousel = () => {
        const carouselSettings = {
            variableWidth: false,
            dots: false,
            prevArrow: <IconButton icon={IconVariant.ARROW_LEFT} />,
            nextArrow: <IconButton icon={IconVariant.ARROW_RIGHT} />,
            slidesToShow: 3,
            centerMode: true,
        };

        if (this.props.post.products.length < 4) {
            return (
                <div className="post-card-products">
                    {this.props.post.products.map(product => (
                        <img
                            onMouseEnter={() => this._onProductMouseEnter(product)}
                            className={`product-image${this.state.focusedProduct.id === product.id ? " selected" : ""}`}
                            src={product.image && product.image.thumbnail_image_url}
                            onClick={() => this.props.history.push(`/product/${product.id}`)}
                        />
                    ))}
                </div>
            );
        }

        return (
            <div className="post-card-products-carousel">
                <Slider {...carouselSettings}>
                    {this.props.post.products.map(product => (
                        <div>
                            <div
                                className={`product-image-container${this.state.focusedProduct.id === product.id ? " selected" : ""}`}
                                onMouseEnter={() => this._onProductMouseEnter(product)}
                                onClick={() => this.props.history.push(`/product/${product.id}`)}
                            >
                                <Image
                                    className="product-image"
                                    square
                                    fit={ImageFitVariant.SCALED}
                                    src={product.image && product.image.thumbnail_image_url}
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }

    private _toggleWishlist = () => {
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

PostCard.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export default withRouter(PostCard);
