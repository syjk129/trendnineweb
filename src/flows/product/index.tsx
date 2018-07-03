import autobind from "autobind-decorator";
import { PropTypes } from "prop-types";
import * as React from "react";
import { BrowserView, isBrowser, isMobile, MobileView } from "react-device-detect";

import { PostPreview } from "../../api/models";
import { AppContext } from "../../app";
import Spinner, { SpinnerContainer } from "../../components/spinner";
import ActionLinks, {ActionLinksVariant} from "../flowComponents/actions";
import RouteProps from "../routeProps";
import DesktopProduct from "./desktop";
import MobileProduct from "./mobile";

import "./style.scss";

type Props = RouteProps;

interface ProductState {
    product: any;
    relatedProducts: Array<any>;
    postsForProduct: Array<PostPreview>;
    reviews: Array<any>;
    wishlisted: boolean;
}

export default class ProductView extends React.Component<Props, ProductState> {
    static contextTypes: AppContext;

    state: ProductState = {
        product: null,
        relatedProducts: [],
        postsForProduct: [],
        reviews: [],
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
            product,
            relatedProducts,
            postsForProduct,
            reviews,
        ] = await Promise.all([
            this.context.api.getProduct(this._productId),
            this.context.api.getRelatedProducts(this._productId),
            this.context.api.getPostsForProduct(this._productId),
            this.context.api.getReviews(this._productId),
        ]);

        const wishlisted = product.wishlisted;

        const recentlyViewed = localStorage.getItem("recentlyViewed");
        let recentlyViewedArray = JSON.parse(recentlyViewed);

        if (!recentlyViewedArray || recentlyViewedArray.length < 1) {
            recentlyViewedArray = [{ type: "product", content: product }];
        } else {
            const indexOfProduct = recentlyViewedArray.findIndex(recent => recent.content.id === product.id);

            if (indexOfProduct !== -1) {
                recentlyViewedArray.splice(indexOfProduct, 1);
            }

            recentlyViewedArray.unshift({ type: "Product", content: product });
        }

        this.setState({
            product,
            relatedProducts,
            postsForProduct,
            reviews,
            wishlisted,
        });

        localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewedArray.slice(0, 5)));
    }

    render() {
        if (!this.state.product) {
            return <SpinnerContainer><Spinner /></SpinnerContainer>;
        }

        return (
            <div>
                <BrowserView device={isBrowser}>
                    <DesktopProduct
                        {...this.state}
                        toggleWishlist={this._toggleWishlist}
                    />
                </BrowserView>
                <MobileView device={isMobile}>
                    <MobileProduct
                        {...this.state}
                        toggleWishlist={this._toggleWishlist}
                    />
                </MobileView>
            </div>
        );
    }

    private _productId: string;

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
    openModal: PropTypes.func,
};
