import * as React from "react";

import "./style.scss";

export enum ImageRatioVariant {
    SQUARE,
    CIRCLE,
    POST_COVER,
    PRODUCT_IMAGE,
    LOOK_COVER,
    ARTICLE_COVER,
    FEATURED_COVER,
}

export enum ImageFitVariant {
    COVER = "cover",
    SCALED = "scaled",
}

interface ImageProps {
    src: string;
    previewSrc?: string;
    className?: string;
    height?: number;
    width?: number;
    inline?: boolean;
    ratio?: ImageRatioVariant;
    fit?: ImageFitVariant;
    square?: boolean;
    circle?: boolean;
    onload?(): void;
    onMouseEnter?(): void;
    onMouseLeave?(): void;
    setRef?(ref: React.RefObject<HTMLDivElement>);
    // setRef?: React.RefObject<HTMLDivElement>;
    onClick?(): void;
}


export default class ImageComponent extends React.Component<ImageProps> {
    componentWillMount() {
        this._containerRef = React.createRef();
        this._imageRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.setRef) {
            this.props.setRef(this._containerRef);
        }
        const container = this._containerRef.current;
        const image = this._imageRef.current;

        if (container && image && this.props.previewSrc) {
            const smallImage = new Image();
            smallImage.src = image.src;
            smallImage.classList.add("blur-image");
            smallImage.onload = () => {
                smallImage.classList.remove("blur-image");
            };

            const largeImage = new Image();
            largeImage.src = this.props.src;
            largeImage.classList.add("blur-image");
            largeImage.onload = () => {
                largeImage.classList.remove("blur-image");
                smallImage.style.display = "none";
            };
            container.appendChild(largeImage);
        }
    }

    render() {
        const {
            className,
            inline,
            height,
            width,
            onMouseEnter,
            onMouseLeave,
            square,
            circle,
            fit,
            ratio,
            onload,
            onClick,
            src,
            previewSrc,
        } = this.props;

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

        if (previewSrc) {
            classes += " blur-in";
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
            case ImageRatioVariant.PRODUCT_IMAGE:
                classes += " product-image-ratio";
                break;
            case ImageRatioVariant.POST_COVER:
                classes += " post-cover-ratio";
                break;
            case ImageRatioVariant.LOOK_COVER:
                classes += " look-cover-ratio";
                break;
            case ImageRatioVariant.ARTICLE_COVER:
                classes += " article-cover-ratio";
                break;
            case ImageRatioVariant.FEATURED_COVER:
                classes += " featured-cover-ratio";
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
                // ref={previewSrc ? this._containerRef : setRef}
                ref={this._containerRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <img className="main-image" src={previewSrc || src} ref={this._imageRef} onLoad={onload}/>
            </div>
        );
    }

    private _imageRef: React.RefObject<HTMLImageElement>;
    private _containerRef: React.RefObject<HTMLDivElement>;
}
