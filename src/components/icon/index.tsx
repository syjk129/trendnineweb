import * as React from "react";

import "./style.scss";

export enum IconVariant {
    // TODO: add in variants
    ARROW_DOWN,
    ARROW_DOWN_RED,
    ARROW_UP,
    ARROW_UP_GREEN,
    ARROW_ZERO,
    LIKE,
    LIKE_FILLED,
    SEARCH,
    TIME,
    WISHLIST,
    WISHLIST_FILLED,
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
        case IconVariant.ARROW_DOWN_RED:
            classes += " icon-arrow-down-red";
            break;
        case IconVariant.ARROW_UP:
            classes += " icon-arrow-up";
            break;
        case IconVariant.ARROW_UP_GREEN:
            classes += " icon-arrow-up-green";
            break;
        case IconVariant.ARROW_ZERO:
            classes += " icon-arrow-zero";
            break;
        case IconVariant.LIKE:
            classes += " icon-like";
            break;
        case IconVariant.LIKE_FILLED:
            classes += " icon-like-filled";
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
        case IconVariant.WISHLIST_FILLED:
            classes += " icon-wishlist-filled";
            break;
        case IconVariant.GIRL:
            classes += " icon-girl";
            break;
        case IconVariant.BAG:
            classes += " icon-bag";
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
