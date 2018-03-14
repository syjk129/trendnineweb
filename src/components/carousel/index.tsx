import * as React from "react";
import Slider, { Settings } from "react-slick";

import CarouselItem from "./carouselItem";

interface CarouselProps {
    slidesToShow?: number;
    children?: React.ReactNode;
}

export default function Carousel({ children, slidesToShow }: CarouselProps) {
    const defaultSettings = {
        infinite: true,
        slidesToShow: slidesToShow || 3,
        slidesToScroll: 1,
    };

    return (
        <div className="carousel-container">
            <Slider {...defaultSettings}>
                {children}
            </Slider>
        </div>
    );
}

export { CarouselItem };
