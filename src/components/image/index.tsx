import * as React from "react";

import "./style.scss";

interface ImageProps {
    src: string;
    className?: string;
    square?: boolean;
    onClick?(): void;
}


export default function Image({ src, className, square, onClick }: ImageProps) {
    let classes = "image-container";

    if (className) {
        classes += ` ${className}`;
    }

    if (square) {
        classes += " square-image";
    }

    return (
        <div className={classes} onClick={onClick}>
            <img src={src} />
        </div>
    );
}
