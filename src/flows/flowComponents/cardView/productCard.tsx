import * as React from "react";

import Card from "../../../components/card";

interface ProductCardProps {
    product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
    const footerItem = (
        <div>
            <p>{product.brand.name}</p>
            <p>Sold by {product.merchant.name}</p>
            <p>${product.price}</p>
        </div>
    );

    return (
        <Card
            imageUrl={product.image.small_image_url}
            redirectUrl={product.id}
            title={product.title}
            footerItem={footerItem}
        />
    );
}
