import * as React from "react";

import Card from "../../../components/card";

interface ProductCardProps {
    product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card
            imageUrl={product.image.small_image_url}
            redirectUrl={product.id}
            title={product.title}
        />
    );
}
