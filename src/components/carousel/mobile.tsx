import * as React from "react";
import Slider, { Settings } from "react-slick";

import CarouselItem from "./carouselItem";
import { CarouselProps } from "./types";

export default function MobileCarousel({
    className,
    attributes,
    children,
    slidesToShow,
}: CarouselProps) {
    let settings = {
        arrows: false,
        dots: true,
        slidesToShow: slidesToShow || 2,
        slidesToScroll: 1,
    };

    if (attributes) {
        settings = Object.assign(settings, attributes);
    }

    let classes = "mobile-carousel-container";

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
