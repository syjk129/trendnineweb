import * as React from "react";

import "./style.scss";

export enum ImageRatioVariant {
    SQUARE,
    CIRCLE,
    POST_COVER,
}

export enum ImageFitVariant {
    COVER = "cover",
    SCALED = "scaled",
}

interface ImageProps {
    src: string;
    className?: string;
    height?: number;
    width?: number;
    inline?: boolean;
    ratio?: ImageRatioVariant;
    fit?: ImageFitVariant;
    square?: boolean;
    circle?: boolean;
    onMouseEnter?(): void;
    onMouseLeave?(): void;
    setRef?: React.RefObject<HTMLDivElement>;
    onClick?(): void;
}

export default class Image extends React.Component<ImageProps> {
    render() {
        const { className, inline, height, width, onMouseEnter, onMouseLeave, square, circle, fit, ratio, setRef, onClick, src } = this.props;

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

        if (width && height) {
            classes += " nojump";
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
        let style;
        if (height && width) {
            style = {
                paddingBottom: `${height / width * 100}%`,
            };
        }

        return (
            <div
                className={classes}
                onClick={onClick}
                style={style}
                ref={setRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <img src={src}/>
            </div>
        );
    }
}
