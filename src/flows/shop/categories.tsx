import * as React from "react";

import Image from "../../components/image";

import * as Bags from "./images/bags.png";
import * as Denim from "./images/denim.png";
import * as Dresses from "./images/dresses.png";
import * as Hats from "./images/hats.png";
import * as Jackets from "./images/jackets.png";
import * as Pants from "./images/pants.png";
import * as Shoes from "./images/shoes.png";
import * as Shorts from "./images/shorts.png";
import * as Skirts from "./images/skirts.png";
import * as Sunglasses from "./images/sunglasses.png";
import * as Swimwear from "./images/swimwear.png";

enum Categories {
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

export default function renderCategories() {
    return Object.keys(Categories).map((category: Categories) => (
        <div>
            <div className="category">
                <Image src={getImageForCategory(Categories[category])} />
                <p className="category-name">{Categories[category]}</p>
            </div>
        </div>
    ));
}

function getImageForCategory(category: Categories) {
    switch (category) {
        case Categories.BAGS:
            return Bags;
        case Categories.DENIM:
            return Denim;
        case Categories.DRESSES:
            return Dresses;
        case Categories.HATS:
            return Hats;
        case Categories.JACKETS:
            return Jackets;
        case Categories.PANTS:
            return Pants;
        case Categories.SHOES:
            return Shoes;
        case Categories.SHORTS:
            return Shorts;
        case Categories.SKIRTS:
            return Skirts;
        case Categories.SUNGLASSES:
            return Sunglasses;
        case Categories.SWIMWEAR:
            return Swimwear;
    }
}
