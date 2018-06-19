import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import Image, { ImageFitVariant } from "../image";

import "./style.scss";

interface CarouselItemProps {
    imageUrl: string;
    imageClass?: string;
    className?: string;
    fit?: ImageFitVariant;
    redirectUrl?: string;
    large?: boolean;
    title?: string;
    detail?: string;
    selected?: boolean;
    subdetail?: string;
    onClick?(): void;
    history: H.History;
}

class CarouselItem extends React.Component<CarouselItemProps> {
    render() {
        const { imageUrl, className, fit, imageClass, redirectUrl, large, title, detail, subdetail, selected, onClick, history } = this.props;

        let imageClasses = "carousel-item-cover";

        if (imageClass) {
            imageClasses += ` ${imageClass}`;
        }

        let classes = "carousel-item";

        if (className) {
            classes += ` ${className}`;
        }

        if (large) {
            classes += " large";
        }

        if (selected) {
            classes += " selected";
        }

        const clickHandler = redirectUrl ? () => history.push(redirectUrl) : onClick;

        return (
            <div>
                <div className={classes} onClick={clickHandler}>
                    <Image className={imageClasses} src={imageUrl} fit={fit || ImageFitVariant.COVER} square />
                    <p className="carousel-item-title">{title}</p>
                    <p>{detail}</p>
                </div>
                <div>{subdetail}</div>
            </div>
        );
    }
}

export default withRouter(CarouselItem);
