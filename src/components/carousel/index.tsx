import * as React from "react";
import Slider, { Settings } from "react-slick";

import CarouselItem from "./carouselItem";

import "./style.scss";

interface CarouselProps {
    className?: string;
    attributes?: any;
    slidesToShow?: number;
    children?: React.ReactNode;
}

export default function Carousel({ className, attributes, children, slidesToShow }: CarouselProps) {
    let settings = {
        adaptiveHeight: false,
        infinite: true,
        slidesToShow: slidesToShow || 3,
        slidesToScroll: 1,
    };

    if (attributes) {
        settings = Object.assign(settings, attributes);
    }

    let classes = "carousel-container";

    if (className) {
        classes += ` ${className}`;
    }

    return (
        <div className={classes}>
            <Slider {...settings}>
                {children}
            </Slider>
        </div>
    );
}

export { CarouselItem };
