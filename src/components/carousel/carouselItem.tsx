import * as React from "react";
import * as H from "history";
import { withRouter } from "react-router-dom";

import Image from "../image";

import "./style.scss";

interface CarouselItemProps {
    imageUrl: string;
    title: string;
    detail: string;
    subdetail?: string;
    history: H.History;
}

class CarouselItem extends React.Component<CarouselItemProps> {
    render() {
        const { imageUrl, title, detail, subdetail } = this.props;

        return (
            <div className="carousel-item" onClick={() => { console.log("wtf"); }}>
                <Image className="carousel-item-cover" src={imageUrl} square />
                <p className="carousel-item-title">{title}</p>
                <p>{detail}</p>
                <p>{subdetail}</p>
            </div>
        );
    }
}

export default withRouter(CarouselItem);
