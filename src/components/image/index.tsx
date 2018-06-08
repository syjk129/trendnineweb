import * as React from "react";

import "./style.scss";

export enum ImageRatioVariant {
    SQUARE,
    CIRCLE,
    POST_COVER,
}

export enum ImageFitVariant {
    COVER,
    SCALED,
}

interface ImageProps {
    src: string;
    className?: string;
    inline?: boolean;
    ratio?: ImageRatioVariant;
    fit?: ImageFitVariant;
    square?: boolean;
    circle?: boolean;
    setRef?(element: Element): void;
    onClick?(): void;
}

export default class Image extends React.Component<ImageProps> {
    render() {
        const { className, inline, square, circle, fit, ratio, setRef, onClick, src } = this.props;

        let classes = "image-container";

        if (className) {
            classes += ` ${className}`;
        }

        if (inline) {
            classes += " inline";
        }

        if (square) {
            classes += " square-image";
        }

        if (circle) {
            classes += " circle-image";
        }

        switch (fit) {
            case ImageFitVariant.SCALED:
                classes += " scaled";
                break;
            case ImageFitVariant.COVER:
            default:
                classes += " cover";
                break;
        }

        switch (ratio) {
            case ImageRatioVariant.POST_COVER:
                classes += " post-cover-ratio";
                break;
        }

        return (
            <div className={classes} onClick={onClick} ref={setRef}>
                <img src={src} />
            </div>
        );
    }
}
