import * as H from "history";
import * as React from "react";
import { withRouter } from "react-router-dom";

import Image from "../image";

import "./style.scss";

interface CarouselItemProps {
    imageUrl: string;
    imageClass?: string;
    className?: string;
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
        const { imageUrl, className, imageClass, redirectUrl, large, title, detail, subdetail, selected, onClick, history } = this.props;

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
            <div className={classes} onClick={clickHandler}>
                <Image className={imageClasses} src={imageUrl} square />
                <p className="carousel-item-title">{title}</p>
                <p>{detail}</p>
                <p>{subdetail}</p>
            </div>
        );
    }
}

export default withRouter(CarouselItem);
