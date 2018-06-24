import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";
import { match } from "react-router-dom";

import { Post } from "../../api/models";
import { AppContext, AppContextTypes } from "../../app";
import Button, { ButtonVariant } from "../../components/button";
import Carousel, { CarouselItem } from "../../components/carousel";
import Content from "../../components/content";
import Image from "../../components/image";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import ActionLinks, {ActionLinksVariant} from "../flowComponents/actions";
import Comments from "../flowComponents/comments";
import Featured from "../flowComponents/featured";
import { ContentSection, SidebarSection } from "../flowComponents/section";
import SidebarGrid from "../flowComponents/sidebarGrid";
import RouteProps from "../routeProps";
import DesktopProduct from "./desktop";
import MobileProduct from "./mobile";

import "./style.scss";

type Props = RouteProps;

interface ProductState {
    currentProduct: any;
    relatedProducts: Array<any>;
    reviews: Array<any>;
    selectedImage: string;
    wishlisted: boolean;
}

export default class ProductView extends React.Component<Props, ProductState> {
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

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.location !== this.props.location) {
            this.refreshContent(nextProps);
        }
    }

    async refreshContent(props: Props) {
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

        window.open(currentProduct.url, "_blank");

        const wishlisted = currentProduct.wishlisted;

        const recentlyViewed = localStorage.getItem("recentlyViewed");
        let recentlyViewedArray = JSON.parse(recentlyViewed);

        if (!recentlyViewedArray || recentlyViewedArray.length < 1) {
            recentlyViewedArray = [{ type: "product", content: currentProduct }];
        } else {
            const indexOfProduct = recentlyViewedArray.findIndex(recent => recent.content.id === currentProduct.id);

            if (indexOfProduct !== -1) {
                recentlyViewedArray.splice(indexOfProduct, 1);
            }

            recentlyViewedArray.unshift({ type: "Product", content: currentProduct });
        }

        this.setState({
            currentProduct,
            relatedProducts,
            selectedImage: currentProduct.image.original_image_url,
            reviews,
            wishlisted,
        });

        localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewedArray.slice(0, 5)));
    }

    render() {
        if (!this.state.currentProduct) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        return (
            <div>
                <BrowserView device={isBrowser}>
                    <DesktopProduct
                        product={this.state.currentProduct}
                        relatedProducts={this.state.relatedProducts}
                        reviews={this.state.reviews}
                        wishlisted={this.state.wishlisted}
                        toggleWishlist={this._toggleWishlist}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileProduct
                        product={this.state.currentProduct}
                        relatedProducts={this.state.relatedProducts}
                        reviews={this.state.reviews}
                        wishlisted={this.state.wishlisted}
                        toggleWishlist={this._toggleWishlist}
                    />
                </MobileView>
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
