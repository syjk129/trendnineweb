import * as React from "react";

import "./style.scss";

export enum IconVariant {
    // TODO: add in variants
    ARROW_DOWN,
    ARROW_UP,
    LIKE,
    SEARCH,
    TIME,
    WISHLIST,
    GIRL,
    BAG,
}

interface IconProps {
    large?: boolean;
    className?: string;
    variant?: IconVariant;
    children?: React.ReactNode;
}

export default function Icon({ className, large, variant, children }: IconProps) {
    let classes = "icon";
    if (className) {
        classes += ` ${className}`;
    }

    if (large) {
        classes += " large";
    }

    switch (variant) {
        case IconVariant.ARROW_DOWN:
            classes += " icon-arrow-down";
            break;
        case IconVariant.ARROW_UP:
            classes += " icon-arrow-up";
            break;
        case IconVariant.LIKE:
            classes += " icon-like";
            break;
        case IconVariant.SEARCH:
            classes += " icon-search";
            break;
        case IconVariant.TIME:
            classes += " icon-time";
            break;
        case IconVariant.WISHLIST:
            classes += " icon-wishlist";
            break;
        case IconVariant.GIRL:
            classes += " icon-bag";
            break;
        case IconVariant.BAG:
            classes += " icon-girl";
            break;
        default:
            break;
    }

    // TODO: add variant to set icons
    switch (variant) {
        default:
            break;
    }

    return (
        <span className={classes}></span>
    );
}
