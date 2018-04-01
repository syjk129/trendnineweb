import * as React from "react";

import "./style.scss";

export enum ImageRatioVariant {
    SQUARE,
    CIRCLE,
    POST_COVER,
}

interface ImageProps {
    src: string;
    className?: string;
    ratio?: ImageRatioVariant;
    square?: boolean;
    circle?: boolean;
    onClick?(): void;
}

export default function Image({ src, className, ratio, square, circle, onClick }: ImageProps) {
    let classes = "image-container";

    if (className) {
        classes += ` ${className}`;
    }

    if (square) {
        classes += " square-image";
    }

    if (circle) {
        classes += " circle-image";
    }

    switch (ratio) {
        case ImageRatioVariant.POST_COVER:
            classes += " post-cover-ratio";
            break;
    }

    return (
        <div className={classes} onClick={onClick}>
            <img src={src} />
        </div>
    );
}
