import { PropTypes } from "prop-types";
import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link, withRouter } from "react-router-dom";

import { Product } from "../../../../api/models";
import { AppContext } from "../../../../app";
import { IconButton } from "../../../../components/button";
import { IconVariant } from "../../../../components/icon";
import Image, { ImageFitVariant, ImageRatioVariant } from "../../../../components/image";

import "./style.scss";

interface ShopCardProps {
    product: Product;
    className?: string;
    clearData: boolean;
    onload?(): void;
}

interface ShopCardState {
    wishlisted: boolean;
}

class ShopCard extends React.Component<ShopCardProps, ShopCardState> {
    static contextTypes: AppContext;

    state: ShopCardState = {
        wishlisted: this.props.product.wishlisted,
    };

    render() {
        const { product, className, onload } = this.props;

        let classes = "shop-card";

        if (className) {
            classes += ` ${className}`;
        }

        const imageUrl = product.image && (isMobile ? product.image.small_image_url : product.image.thumbnail_image_url);

        return (
            <div className="shop-card-container">
                <Link
                    to={{
                        pathname: `/product/${product.id}`,
                        state: {
                            modal: !isMobile,
                            clearData: this.props.clearData,
                        },
                    }}
                    className={classes}
                >
                    <Image
                        className="product-image"
                        src={imageUrl}
                        fit={ImageFitVariant.SCALED}
                        ratio={ImageRatioVariant.LOOK_COVER}
                        onload={onload}
                    />
                    <div className="shop-card-details">
                        <b className="product-brand">{product.brand && product.brand.name}</b>
                        <div className="product-name">{product.title}</div>
                        <div className="product-price">${product.price}</div>
                    </div>
                    <div className="wishlist">
                        <IconButton
                            icon={IconVariant.WISHLIST}
                            selected={this.state.wishlisted}
                            onClick={this._toggleWishlist}
                        />
                    </div>
                </Link>
            </div>
        );
    }

    private _toggleWishlist = () => {
        if (this.state.wishlisted) {
            this.context.api.unwishlist(this.props.product.id, "product");
        } else {
            this.context.api.wishlist(this.props.product.id, "product");
        }
        this.setState({ wishlisted: !this.state.wishlisted });
    }
}

ShopCard.contextTypes = {
    api: PropTypes.any,
    setError: PropTypes.func,
    openModal: PropTypes.func,
};

export default withRouter(ShopCard);
