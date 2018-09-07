import * as React from "react";
import { isMobile } from "react-device-detect";
import { Link, withRouter } from "react-router-dom";

import { Product } from "../../../../api/models";
import Image, { ImageFitVariant, ImageRatioVariant } from "../../../../components/image";

interface ShopCardProps {
    product: Product;
    className?: string;
    clearData?(): void;
    onload?(): void;
}

class ShopCard extends React.Component<ShopCardProps> {
    render() {
        const { product, className, onload } = this.props;

        let classes = "shop-card";

        if (className) {
            classes += ` ${className}`;
        }

        const imageUrl = product.image && (isMobile ? product.image.small_image_url : product.image.thumbnail_image_url);

        return (
            <div className={classes}>
                <Link
                    to={{
                        pathname: `/product/${product.id}`,
                        state: {
                            modal: !isMobile,
                            clearData: this.props.clearData,
                        },
                    }}
                    className="product-card-image"
                >
                    <Image
                        className="product-image"
                        src={imageUrl}
                        fit={ImageFitVariant.COVER}
                        ratio={ImageRatioVariant.LOOK_COVER}
                        onload={onload}
                    />
                </Link>
            </div>
        );
    }
}

export default withRouter(ShopCard);
