import * as React from "react";
import { Link } from "react-router-dom";

import Image from "../../components/image";

import { getMarketingImage } from "./images";

export enum Categories {
    BAGS = "Bags",
    DENIM = "Denim",
    DRESSES = "Dresses",
    HATS = "Hats",
    JACKETS = "Jackets",
    PANTS = "Pants",
    SHOES = "Shoes",
    SHORTS = "Shorts",
    SKIRTS = "Skirts",
    SUNGLASSES = "Sunglasses",
    SWIMWEAR = "Swimwear",
}

const URLForCategory = {
    [Categories.BAGS]: "Handbags",
    [Categories.DENIM]: "Women%27S%20Jeans",
    [Categories.DRESSES]: "Dresses",
    [Categories.HATS]: "Women%27S%20Hats",
    [Categories.JACKETS]: "Women%27S%20Jackets",
    [Categories.PANTS]: "Women%27S%20Pants",
    [Categories.SHOES]: "Women%27S%20Shoes",
    [Categories.SHORTS]: "Women%27S%20Shorts",
    [Categories.SKIRTS]: "Skirts",
    [Categories.SUNGLASSES]: "Women%27S%20Accessories",
    [Categories.SWIMWEAR]: "Women%27S%20Swimwear",
};

export default function renderCategories() {
    return Object.keys(Categories).map((category) => {
        const image = getMarketingImage(Categories[category]);
        return (
            <div>
                <Link to={`/shop/discover?categories=${URLForCategory[Categories[category]]}`} className="category">
                    <Image
                        src={image.originalImage}
                        previewSrc={image.smallImage}
                        width={image.width}
                        height={image.height}
                    />
                    <p className="category-name">{Categories[category]}</p>
                </Link>
            </div>
        );
    });
}
