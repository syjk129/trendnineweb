import * as React from "react";

import "./style.scss";

interface ImageProps {
    src: string;
    className?: string;
    square?: boolean;
    circle?: boolean;
    onClick?(): void;
}


export default function Image({ src, className, square, circle, onClick }: ImageProps) {
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

    return (
        <div className={classes} onClick={onClick}>
            <img src={src} />
        </div>
    );
}
