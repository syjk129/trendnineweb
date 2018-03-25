import * as React from "react";
import * as H from "history";
import { withRouter } from "react-router-dom";

import Image from "../image";

import "./style.scss";

interface CarouselItemProps {
    imageUrl: string;
    title?: string;
    detail?: string;
    selected?: boolean;
    subdetail?: string;
    onClick?(): void;
    history: H.History;
}

class CarouselItem extends React.Component<CarouselItemProps> {
    render() {
        const { imageUrl, title, detail, subdetail, selected, onClick } = this.props;

        let classes = "carousel-item-cover";

        if (selected) {
            classes += " selected";
        }

        return (
            <div className="carousel-item" onClick={onClick}>
                <Image className={classes} src={imageUrl} square />
                <p className="carousel-item-title">{title}</p>
                <p>{detail}</p>
                <p>{subdetail}</p>
            </div>
        );
    }
}

export default withRouter(CarouselItem);
