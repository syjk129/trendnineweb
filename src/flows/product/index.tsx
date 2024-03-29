import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";

import { PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import Modal from "../../components/modal";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import RouteProps from "../routeProps";
import DesktopProduct from "./desktop";
import MobileProduct from "./mobile";

import "./style.scss";

interface ProductProps extends RouteProps {
    close(): void;
}

interface ProductState {
    product: any;
    relatedProducts: Array<any>;
    postsForProduct: Array<PostPreview>;
    reviews: Array<any>;
    wishlisted: boolean;
    isLoading: boolean;
}

export default class ProductView extends React.Component<ProductProps, ProductState> {
    static contextTypes: AppContext;

    state: ProductState = {
        product: null,
        relatedProducts: [],
        postsForProduct: [],
        reviews: [],
        wishlisted: false,
        isLoading: false,
    };

    componentWillMount() {
        this._isModal = this.props.location.state && this.props.location.state.modal;
        this._pageRef = React.createRef();
        this._scrollRef = React.createRef();

        this.refreshContent(this.props);
    }

    componentWillReceiveProps(nextProps: ProductProps) {
        if (nextProps.location !== this.props.location &&
            !nextProps.location.pathname.includes("share") && !nextProps.location.pathname.includes("login") && !nextProps.location.pathname.includes("onboarding")
        ) {
            this.refreshContent(nextProps);
        }
    }

    async refreshContent(props: ProductProps) {
        this.setState({ isLoading: true });
        const productId = props.match.params.productId;
        const [
            product,
            relatedProducts,
            postsForProduct,
            reviews,
        ] = await Promise.all([
            this.context.api.getProduct(productId),
            this.context.api.getRelatedProducts(productId),
            this.context.api.getPostsForProduct(productId),
            this.context.api.getReviews(productId),
        ]);

        this._productId = props.match.params.productId;
        const wishlisted = product.wishlisted;

        const recentlyViewed = localStorage.getItem("recentlyViewed");
        let recentlyViewedArray = JSON.parse(recentlyViewed);

        if (!recentlyViewedArray || recentlyViewedArray.length < 1) {
            recentlyViewedArray = [{ type: "Product", content: product }];
        } else {
            const indexOfProduct = recentlyViewedArray.findIndex(recent => recent.content.id === product.id);

            if (indexOfProduct !== -1) {
                recentlyViewedArray.splice(indexOfProduct, 1);
            }

            recentlyViewedArray.unshift({ type: "Product", content: product });
        }

        this.setState({
            product,
            relatedProducts: relatedProducts.slice(0, 9),
            postsForProduct,
            reviews,
            wishlisted,
            isLoading: false,
        });

        localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewedArray.slice(0, 5)));
    }

    render() {
        const ContainerEl = this._isModal ? Modal : "div";
        let props;
        if (this._isModal) {
            props = {
                className: "post-modal",
                contentRef: this._pageRef,
                scrollRef: this._scrollRef,
                close: this.props.close,
                fullScreen: isMobile,
            };
        } else {
            props = { ref: this._pageRef };
        }

        return (
            <>
                <ContainerEl {...props} isOpen>
                    {this.state.isLoading ? (
                        <Spinner />
                    ) : (
                        isMobile ? (
                            <MobileProduct
                                {...this.state}
                                scrollRef={this._scrollRef}
                                isModal={this._isModal}
                                toggleWishlist={this._toggleWishlist}
                                onProductClick={this._onProductClick}
                            />
                        ) : (
                            <DesktopProduct
                                {...this.state}
                                scrollRef={this._scrollRef}
                                isModal={this._isModal}
                                toggleWishlist={this._toggleWishlist}
                                onProductClick={this._onProductClick}
                            />
                        )
                    )}
                </ContainerEl>
            </>
        );
    }

    private _pageRef: React.RefObject<HTMLDivElement>;
    private _scrollRef: React.RefObject<HTMLDivElement>;
    private _productId: string;
    private _isModal: boolean;

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

    private _onProductClick = () => {
        const queryParams = this.props.location.search.slice(1).split("&");
        let referrerType;
        let referrerId;
        queryParams.forEach(param => {
            const query = param.split("=");
            if (query.length < 2) {
                return;
            } else if (query[0].toLowerCase() === "referrer_type") {
                referrerType = query[1];
            } else if (query[0].toLowerCase() === "referrer_id") {
                referrerId = query[1];
            }
        });
        if (referrerId && referrerType) {
            if (referrerType.toLowerCase() === "post") {
                this.context.api.trackClickFromPost(referrerId, this._productId);
            } else if (referrerType.toLowerCase() === "user") {
                this.context.api.trackClickFromInfluencer(referrerType, this._productId);
            }
        }
        window.open(this.state.product.url);
    }
}

ProductView.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};
